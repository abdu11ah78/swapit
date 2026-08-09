"use client";

import React from "react";
import { AppraisalWidget } from "@/components/valuation/AppraisalWidget";
import { MarketplaceHeader } from "@/components/layout/Header";

export default function AppraisePage() {
  return (
    <>
      <MarketplaceHeader />
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #f0fdfa 0%, #f8fafc 50%, #ecfdf5 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "6rem 1.5rem 4rem",
        }}
      >
        {/* Hero copy */}
        <div style={{ textAlign: "center", maxWidth: "540px", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              background: "rgba(13,148,136,0.08)",
              color: "#0d9488",
              borderRadius: "999px",
              padding: "0.35rem 1rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            <span>🤖</span> Powered by Multimodal AI
          </div>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 5vw, 2.75rem)",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 0.75rem",
              lineHeight: 1.15,
            }}
          >
            Instant AI{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #0d9488, #0f766e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Appraisal
            </span>
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#64748b",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Our late-fusion neural network analyses your item&rsquo;s description,
            mileage, and condition to predict its fair market value — no guesswork.
          </p>
        </div>

        {/* Widget */}
        <AppraisalWidget
          defaultAnchorPricePkr={238_500}
          categoryLabel="Motorbike"
        />

        {/* Disclaimer */}
        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.72rem",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "420px",
          }}
        >
          Estimates are AI-generated and intended as a reference only. Actual
          transaction prices may vary. Showroom anchor defaults to Honda CG-125
          (PKR 238,500).
        </p>
      </main>
    </>
  );
}
