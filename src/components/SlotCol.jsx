import { T, FS, FW, OPT, optFor } from "../styles/theme";

export default function SlotCol({ slot, value, onChange, ouiCount, total, compact }) {
  const active = optFor(value);
  const w = compact ? 78 : 90;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        borderRadius: compact ? 9 : 11,
        border: `2px solid ${active ? active.border : T.border}`,
        background: active ? active.light : T.surfaceAlt,
        transition: "border-color 0.15s, background 0.15s",
        overflow: "hidden",
        minWidth: w,
        flex: compact ? `0 0 ${w}px` : `1 0 ${w}px`,
        maxWidth: compact ? undefined : 140,
      }}
    >
      <div
        style={{
          padding: compact ? "0.35rem 0.25rem 0.3rem" : "0.5rem 0.35rem 0.4rem",
          textAlign: "center",
          borderBottom: `1px solid ${active ? active.border : T.border}`,
          background: active ? active.bg + "99" : "white",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ fontWeight: FW.heavy, fontSize: FS.xs, color: T.text, lineHeight: 1.3 }}>
          {slot.label}
        </div>
        {slot.sub && (
          <div style={{ fontWeight: FW.heavy, fontSize: compact ? FS.xs : FS.sm, color: active ? active.col : T.primaryDk }}>
            {slot.sub}
          </div>
        )}
        <div style={{ marginTop: "auto", paddingTop: compact ? "0.2rem" : "0.3rem" }}>
          <span
            style={{
              fontSize: FS.xs,
              fontWeight: FW.heavy,
              background:
                ouiCount === 0 ? "#F5F5F4" : ouiCount <= 2 ? "#FEF3C7" : "#D1FAE5",
              color:
                ouiCount === 0 ? "#57534E" : ouiCount <= 2 ? "#92400E" : "#065F46",
              borderRadius: 99,
              padding: compact ? "0.05rem 0.3rem" : "0.08rem 0.42rem",
            }}
          >
            {ouiCount > 0 ? `${ouiCount} ✓` : total === 0 ? "—" : "0 ✓"}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {OPT.map((opt, i) => (
          <button
            key={opt.v}
            onClick={() => onChange(value === opt.v ? undefined : opt.v)}
            aria-label={`${opt.label} pour ${slot.label}${slot.sub ? " " + slot.sub : ""}`}
            style={{
              width: "100%",
              padding: compact ? "0.32rem 0.15rem" : "0.48rem 0.2rem",
              border: "none",
              borderTop:
                i > 0
                  ? `1px solid ${value === opt.v ? opt.border : T.border}`
                  : "none",
              cursor: "pointer",
              fontFamily: T.font,
              fontWeight: value === opt.v ? FW.heavy : FW.medium,
              fontSize: compact ? FS.xs : FS.sm,
              background: value === opt.v ? opt.bg : "transparent",
              color: value === opt.v ? opt.col : T.muted,
              transition: "all 0.1s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.18rem",
            }}
          >
            <span style={{ fontSize: compact ? FS.xs : FS.sm }}>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
