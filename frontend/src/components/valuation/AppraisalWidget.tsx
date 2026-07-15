"use client";

import React, { useState } from "react";
import { appraiseItem, AppraiseResponse } from "@/features/valuation/valuation.api";

// ─── Styles (inline for portability, same design language as the rest of the app) ──
const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";
const TEAL_LIGHT = "rgba(13,148,136,0.08)";

// Confidence colour map
const CONFIDENCE_COLOUR: Record<string, { bg: string; text: string }> = {
  High:   { bg: "#d1fae5", text: "#065f46" },
  Medium: { bg: "#fef3c7", text: "#92400e" },
  Low:    { bg: "#fee2e2", text: "#991b1b" },
};

interface Props {
  /** Pre-fill a default showroom price (e.g. 238,500 for Honda CG-125) */
  defaultAnchorPricePkr?: number;
  /** Pre-fill a category label shown in the header */
  categoryLabel?: string;
}

const DEFAULT_ANCHOR = 238_500;

export function AppraisalWidget({
  defaultAnchorPricePkr = DEFAULT_ANCHOR,
  categoryLabel = "Motorbike",
}: Props) {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [description, setDescription] = useState("");
  const [mileage, setMileage] = useState<string>("");
  const [damageCount, setDamageCount] = useState<string>("0");
  const [anchorPrice, setAnchorPrice] = useState<string>(
    String(defaultAnchorPricePkr)
  );

  // ── UX state ────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AppraiseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const mileageNum = parseFloat(mileage);
    const damageNum = parseInt(damageCount, 10);
    const anchorNum = parseFloat(anchorPrice);

    if (!description.trim()) {
      setError("Please enter an item description.");
      return;
    }
    if (isNaN(mileageNum) || mileageNum < 0) {
      setError("Mileage must be a non-negative number.");
      return;
    }
    if (isNaN(damageNum) || damageNum < 0) {
      setError("Damage count must be a non-negative integer.");
      return;
    }

    setLoading(true);
    try {
      const data = await appraiseItem({
        description: description.trim(),
        mileage: mileageNum,
        damageCount: damageNum,
        anchorPricePkr: isNaN(anchorNum) ? defaultAnchorPricePkr : anchorNum,
      });
      setResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not reach the AI service.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  const conf = result ? CONFIDENCE_COLOUR[result.confidence] ?? CONFIDENCE_COLOUR.Medium : null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)",
        borderRadius: "1.5rem",
        border: "1px solid rgba(13,148,136,0.18)",
        boxShadow: "0 20px 60px rgba(13,148,136,0.12)",
        padding: "2rem",
        maxWidth: "520px",
        width: "100%",
        fontFamily: "Outfit, Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem" }}>
          <span style={{ fontSize: "1.4rem" }}>🤖</span>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
            AI Appraisal
          </h2>
          <span
            style={{
              marginLeft: "auto",
              background: TEAL_LIGHT,
              color: TEAL,
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.2rem 0.65rem",
              borderRadius: "999px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {categoryLabel}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>
          Get an instant AI-computed market-value estimate for your item.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Description */}
        <div>
          <label style={labelStyle}>Item Description</label>
          <textarea
            id="appraisal-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. 2021 Honda CG-125, self use, original paint, no accidents..."
            style={inputStyle}
            disabled={loading}
          />
        </div>

        {/* Mileage + Damage row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={labelStyle}>Mileage (km)</label>
            <input
              id="appraisal-mileage"
              type="number"
              min={0}
              step={100}
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="e.g. 15000"
              style={inputStyle}
              disabled={loading}
            />
          </div>
          <div>
            <label style={labelStyle}>Damage Count</label>
            <input
              id="appraisal-damage"
              type="number"
              min={0}
              max={10}
              step={1}
              value={damageCount}
              onChange={(e) => setDamageCount(e.target.value)}
              placeholder="0–10"
              style={inputStyle}
              disabled={loading}
            />
          </div>
        </div>

        {/* Anchor price */}
        <div>
          <label style={labelStyle}>
            Showroom Price (PKR)
            <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: "0.4rem" }}>
              (Honda CG-125 default)
            </span>
          </label>
          <input
            id="appraisal-anchor"
            type="number"
            min={1}
            step={500}
            value={anchorPrice}
            onChange={(e) => setAnchorPrice(e.target.value)}
            placeholder="238500"
            style={inputStyle}
            disabled={loading}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              fontSize: "0.82rem",
              fontWeight: 500,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button
          id="appraisal-submit"
          type="submit"
          disabled={loading}
          style={{
            background: loading
              ? "#ccfbf1"
              : `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
            color: loading ? TEAL : "#fff",
            border: "none",
            borderRadius: "0.875rem",
            padding: "0.875rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {loading ? (
            <>
              <span style={spinnerStyle} />
              Appraising…
            </>
          ) : (
            "✨ Get AI Appraisal"
          )}
        </button>
      </form>

      {/* Result Card */}
      {result && conf && (
        <div
          style={{
            marginTop: "1.5rem",
            background: "linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)",
            border: `1.5px solid ${TEAL}30`,
            borderRadius: "1.25rem",
            padding: "1.25rem 1.5rem",
            animation: "fadeSlideUp 0.35s ease both",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.1rem" }}>📊</span>
            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>
              Appraisal Result
            </span>
            <span
              style={{
                marginLeft: "auto",
                background: conf.bg,
                color: conf.text,
                borderRadius: "999px",
                padding: "0.2rem 0.65rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {result.confidence} confidence
            </span>
          </div>

          {/* Main value */}
          <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: TEAL, lineHeight: 1.1 }}>
              Rs {result.estimatedValuePkr.toLocaleString("en-PK", { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.2rem" }}>
              Estimated Current Market Value
            </div>
          </div>

          {/* Breakdown */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              fontSize: "0.8rem",
            }}
          >
            <Stat label="Retention" value={`${result.retentionPct.toFixed(1)}%`} />
            <Stat
              label="Showroom Price"
              value={`Rs ${result.anchorPricePkr.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Mini sub-components ───────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.7)",
        borderRadius: "0.75rem",
        padding: "0.5rem 0.75rem",
        border: "1px solid rgba(13,148,136,0.1)",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div style={{ color: "#0f172a", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.15rem" }}>
        {value}
      </div>
    </div>
  );
}

// ── Shared style objects ──────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "0.35rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1.5px solid #e2e8f0",
  borderRadius: "0.75rem",
  padding: "0.65rem 0.875rem",
  fontSize: "0.875rem",
  color: "#0f172a",
  outline: "none",
  background: "#fff",
  transition: "border-color 0.18s",
  fontFamily: "inherit",
  resize: "vertical" as const,
};

const spinnerStyle: React.CSSProperties = {
  width: "14px",
  height: "14px",
  border: "2px solid #0d9488",
  borderTopColor: "transparent",
  borderRadius: "50%",
  display: "inline-block",
  animation: "spin 0.7s linear infinite",
};
