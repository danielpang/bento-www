import { siteDescription, siteHeadlineLines, siteName } from "@/lib/copy";

/**
 * The link-preview card rendered by `next/og` (satori). Only flexbox and a
 * subset of CSS are supported, so every container declares `display: flex`.
 */

const pipelineStages = [
  { name: "Product", state: "done" },
  { name: "Design", state: "done" },
  { name: "Spec", state: "done" },
  { name: "Implementation", state: "running" },
  { name: "Review", state: "gated" },
  { name: "QA", state: "idle" },
] as const;

const stageTone = {
  done: { accent: "#3e77e8", background: "#12161e", label: "#c5d0e0" },
  gated: { accent: "#f2c40d", background: "#16140a", label: "#e4e9f2" },
  idle: { accent: "#3a4353", background: "#0d131d", label: "#7a8dab" },
  running: { accent: "#ff8a3d", background: "#24180f", label: "#e4e9f2" },
} as const;

function BentoMark({ size }: { size: number }) {
  const pad = Math.round(size * 0.146);
  const gap = Math.round(size * 0.104);
  const radius = Math.round(size * 0.083);
  const bottom = Math.round(size * 0.229);

  return (
    <div
      style={{
        background: "#12161e",
        border: `${Math.max(2, Math.round(size * 0.042))}px solid #39414f`,
        borderRadius: Math.round(size * 0.208),
        display: "flex",
        flexDirection: "column",
        gap,
        height: size,
        padding: pad,
        width: size,
      }}
    >
      <div style={{ display: "flex", flex: 1, gap }}>
        <div
          style={{
            background: "#f97316",
            borderRadius: radius,
            width: Math.round(size * 0.417),
          }}
        />
        <div
          style={{ background: "#3a4353", borderRadius: radius, flex: 1 }}
        />
      </div>
      <div style={{ display: "flex", gap, height: bottom }}>
        <div
          style={{
            background: "#3a4353",
            borderRadius: radius,
            width: bottom,
          }}
        />
        <div
          style={{ background: "#3e77e8", borderRadius: radius, flex: 1 }}
        />
      </div>
    </div>
  );
}

export function SocialCard() {
  return (
    <div
      style={{
        background: "#0a0e16",
        color: "#e4e9f2",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "64px 72px 56px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          opacity: 0.18,
          position: "absolute",
          right: "48px",
          top: "96px",
        }}
      >
        <BentoMark size={280} />
      </div>
      <div style={{ alignItems: "center", display: "flex", gap: "18px" }}>
        <BentoMark size={48} />
        <span style={{ fontSize: "32px", fontWeight: 700 }}>{siteName}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          maxWidth: "860px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "64px",
            fontWeight: 650,
            letterSpacing: "-3px",
            lineHeight: 1.08,
          }}
        >
          <div style={{ display: "flex" }}>{siteHeadlineLines[0]}</div>
          <div style={{ display: "flex" }}>{siteHeadlineLines[1]}</div>
        </div>
        <div
          style={{
            color: "#8496b0",
            display: "flex",
            fontSize: "26px",
            lineHeight: 1.35,
            maxWidth: "760px",
          }}
        >
          {siteDescription}
        </div>
      </div>
      <div
        style={{
          background: "#12161e",
          border: "2px solid #33415a",
          borderRadius: "18px",
          display: "flex",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {pipelineStages.map((stage, index) => {
          const tone = stageTone[stage.state];

          return (
            <div
              key={stage.name}
              style={{
                background: tone.background,
                borderLeft: index === 0 ? "none" : "1px solid #232e40",
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: "12px",
                padding: "18px 14px 18px",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    color: tone.accent,
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div
                  style={{
                    background: tone.accent,
                    borderRadius: "2px",
                    flexGrow: 0,
                    flexShrink: 0,
                    height: "8px",
                    minHeight: "8px",
                    minWidth: "8px",
                    width: "8px",
                  }}
                />
              </div>
              <div
                style={{
                  color: tone.label,
                  display: "flex",
                  fontSize: "16px",
                  fontWeight: 650,
                  letterSpacing: "-0.02em",
                }}
              >
                {stage.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
