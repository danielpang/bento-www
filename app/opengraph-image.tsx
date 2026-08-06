import { ImageResponse } from "next/og";

export const alt = "Bento. Orchestrate the whole build.";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#0a0e16",
        color: "#e4e9f2",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px",
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: "18px" }}>
        <div
          style={{
            background: "#12161e",
            border: "2px solid #39414f",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            height: "48px",
            padding: "7px",
            width: "48px",
          }}
        >
          <div style={{ display: "flex", flex: 1, gap: "5px" }}>
            <div
              style={{
                background: "#f97316",
                borderRadius: "4px",
                flex: "0 0 20px",
              }}
            />
            <div
              style={{ background: "#3a4353", borderRadius: "4px", flex: 1 }}
            />
          </div>
          <div style={{ display: "flex", gap: "5px", height: "11px" }}>
            <div
              style={{
                background: "#3a4353",
                borderRadius: "4px",
                flex: "0 0 11px",
              }}
            />
            <div
              style={{ background: "#3e77e8", borderRadius: "4px", flex: 1 }}
            />
          </div>
        </div>
        <span style={{ fontSize: "32px", fontWeight: 700 }}>Bento</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          maxWidth: "880px",
        }}
      >
        <div
          style={{
            fontSize: "76px",
            fontWeight: 650,
            letterSpacing: "-4px",
            lineHeight: 1.03,
          }}
        >
          Orchestrate the whole build.
        </div>
        <div style={{ color: "#8496b0", fontSize: "28px" }}>
          One pipeline for every agent, handoff, and human decision.
        </div>
      </div>
      <div
        style={{
          background: "#ff8a3d",
          borderRadius: "3px",
          height: "6px",
          width: "160px",
        }}
      />
    </div>,
    size,
  );
}
