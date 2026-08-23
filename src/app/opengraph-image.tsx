import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Akshay EV | Full-Stack & AI Agent Engineer";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#11172A",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background ambient radial glow gradient */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 70%)",
          }}
        />

        {/* Top Header Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 18px",
            borderRadius: "9999px",
            backgroundColor: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
            }}
          />
          <span
            style={{
              color: "#34D399",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            SPATIAL ARCHITECTURE // EXECUTIVE PORTFOLIO
          </span>
        </div>

        {/* Main Title Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#FFFFFF",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Akshay EV
          </h1>
          <p
            style={{
              fontSize: "36px",
              fontWeight: 500,
              color: "#94A3B8",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Full-Stack & AI Agent Engineer
          </p>
        </div>

        {/* Footer Metrics / Tech Stack Bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <span style={{ color: "#64748B", fontSize: "18px", fontWeight: 500 }}>
            Next.js 15 • React 19 • Spline 3D • Sanity CMS
          </span>
          <span style={{ color: "#10B981", fontSize: "18px", fontWeight: 600 }}>
            https://akshay.is-a.dev
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
