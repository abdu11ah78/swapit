"""
SwapIt AI Appraisal Microservice
FastAPI server exposing POST /api/v1/appraise

Actual model architecture (from inspect_weights.py):
  vision_extractor : Conv2d(3,16) → ReLU → Conv2d(16,32) → ReLU → AdaptiveAvgPool
  vision_dense     : Linear(512, 64)
  text_dense       : Linear(43,128) → ReLU → Dropout → Linear(128,64)
  tab_dense        : Linear(2,32)   → ReLU → Linear(32,16)
  fusion_network   : Linear(144,64) → ReLU → Dropout → Linear(64,1) → Sigmoid
  (fusion input = 64 vision + 64 text + 16 tab = 144)
"""
import os
import joblib
import logging

import numpy as np
import torch
import torch.nn as nn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ─── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger("swapit-ai")

# ─── Paths ───────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "weights", "multimodal_fusion_model.pth")
TFIDF_PATH = os.path.join(BASE_DIR, "weights", "multimodal_tfidf.pkl")

# ─── Anchor price (Honda CG-125 showroom PKR) ────────────────────────────────
ANCHOR_PRICE_PKR = 238_500.0

# ─── Exact architecture matching the saved checkpoint ────────────────────────
class LateFusionAppraisalNet(nn.Module):
    def __init__(self):
        super().__init__()

        # Vision branch (we pass a zero image when no image is supplied)
        # Indices: 0=Conv2d, 1=ReLU, 2=MaxPool2d, 3=Conv2d, 4=ReLU  ← matches checkpoint
        self.vision_extractor = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, padding=1),   # idx 0 → (16, H, W)
            nn.ReLU(),                                     # idx 1
            nn.MaxPool2d(2, 2),                            # idx 2 → (16, H/2, W/2)
            nn.Conv2d(16, 32, kernel_size=3, padding=1),   # idx 3 → (32, H/2, W/2)
            nn.ReLU(),                                     # idx 4
        )
        self.vision_pool  = nn.AdaptiveAvgPool2d((4, 4))  # → (32, 4, 4) = 512
        self.vision_dense = nn.Linear(512, 64)

        # Text branch: 43 → 128 → 64
        self.text_dense = nn.Sequential(
            nn.Linear(43, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
        )

        # Tabular branch: 2 → 32 → 16
        self.tab_dense = nn.Sequential(
            nn.Linear(2, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
        )

        # Fusion: 64 + 64 + 16 = 144 → 64 → 1 → Sigmoid
        self.fusion_network = nn.Sequential(
            nn.Linear(144, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 1),
            nn.Sigmoid(),
        )

    def forward(self, text_feat, tab_feat, img_feat=None):
        # Vision — use supplied image or a dummy zero tensor
        if img_feat is None:
            img_feat = torch.zeros(text_feat.size(0), 3, 32, 32)
        v = self.vision_extractor(img_feat)          # (B, 32, H, W)
        v = self.vision_pool(v)                       # (B, 32, 4, 4)
        v = v.view(v.size(0), -1)                    # (B, 512)
        v = torch.relu(self.vision_dense(v))          # (B, 64)

        t = self.text_dense(text_feat)               # (B, 64)
        x = self.tab_dense(tab_feat)                 # (B, 16)

        fused = torch.cat([v, t, x], dim=1)          # (B, 144)
        out   = self.fusion_network(fused)            # (B, 1)
        return out.squeeze(1)                         # (B,)


# ─── Globals ─────────────────────────────────────────────────────────────────
_model: LateFusionAppraisalNet | None = None
_tfidf = None


def load_artifacts():
    global _model, _tfidf

    logger.info(f"Loading TF-IDF from {TFIDF_PATH}")
    _tfidf = joblib.load(TFIDF_PATH)

    logger.info(f"Loading model from {MODEL_PATH}")
    _model = LateFusionAppraisalNet()
    checkpoint = torch.load(MODEL_PATH, map_location="cpu", weights_only=True)

    state_dict = (
        checkpoint["model_state_dict"]
        if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint
        else checkpoint
    )
    _model.load_state_dict(state_dict, strict=True)
    _model.eval()
    logger.info("Model loaded and ready on CPU ✓")


# ─── FastAPI ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="SwapIt AI Appraisal Service",
    description="Multimodal late-fusion model for item market-value retention",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    load_artifacts()


# ─── Schemas ─────────────────────────────────────────────────────────────────
class AppraiseRequest(BaseModel):
    description:     str   = Field(..., min_length=3)
    mileage:         float = Field(..., ge=0.0)
    damage_count:    int   = Field(..., ge=0)
    anchor_price_pkr: float = Field(default=ANCHOR_PRICE_PKR, gt=0)


class AppraiseResponse(BaseModel):
    retention_pct:       float
    estimated_value_pkr: float
    anchor_price_pkr:    float
    confidence:          str


# ─── Endpoint ────────────────────────────────────────────────────────────────
@app.post("/api/v1/appraise", response_model=AppraiseResponse)
async def appraise(req: AppraiseRequest):
    if _model is None or _tfidf is None:
        raise HTTPException(status_code=503, detail="Model not yet loaded")

    try:
        # 1. Text: TF-IDF → (1, 43)
        text_vec = _tfidf.transform([req.description]).toarray().astype(np.float32)

        # 2. Tabular: normalise mileage [0,1] over 100k km, damage [0,1] over 10
        mileage_norm = float(min(req.mileage / 100_000.0, 1.0))
        damage_norm  = float(min(req.damage_count / 10.0, 1.0))
        tab_vec = np.array([[mileage_norm, damage_norm]], dtype=np.float32)

        # 3. Inference (no real image → zero tensor handled inside forward())
        with torch.no_grad():
            text_t = torch.tensor(text_vec)   # (1, 43)
            tab_t  = torch.tensor(tab_vec)    # (1, 2)
            raw    = _model(text_t, tab_t)    # Sigmoid scalar
            retention = float(raw.item())

        retention_pct = round(retention * 100.0, 2)
        estimated_pkr = round(req.anchor_price_pkr * retention, 2)

        confidence = (
            "High"   if retention_pct >= 75 else
            "Medium" if retention_pct >= 45 else
            "Low"
        )

        logger.info(
            f"retention={retention_pct}% | value={estimated_pkr:,.0f} PKR | {confidence}"
        )

        return AppraiseResponse(
            retention_pct=retention_pct,
            estimated_value_pkr=estimated_pkr,
            anchor_price_pkr=req.anchor_price_pkr,
            confidence=confidence,
        )

    except Exception as e:
        logger.exception("Inference failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": _model is not None}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
