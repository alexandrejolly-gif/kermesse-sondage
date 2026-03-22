import { T, OPT, optFor } from "../styles/theme";

export default function SlotCol({ slot, value, onChange, ouiCount, total }) {
  const active = optFor(value);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        borderRadius: 11,
        border: `2px solid ${active ? active.border : T.border}`,
        background: active ? active.light : T.surfaceAlt,
        transition: "border-color 0.15s, background 0.15s",
        overflow: "hidden",
        minWidth: 90,
        width: 90,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "0.5rem 0.35rem 0.4rem",
          textAlign: "center",
          borderBottom: `1px solid ${active ? active.border : T.border}`,
          background: active ? active.bg + "99" : "white",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: "0.7rem", color: T.text, lineHeight: 1.3 }}>
          {slot.label}
        </div>
        {slot.sub && (
          <div style={{ fontWeight: 900, fontSize: "0.82rem", color: active ? active.col : T.primaryDk }}>
            {slot.sub}
          </div>
        )}
        <div style={{ marginTop: "auto", paddingTop: "0.3rem" }}>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 900,
              background:
                ouiCount === 0 ? "#F5F5F4" : ouiCount <= 2 ? "#FEF3C7" : "#D1FAE5",
              color:
                ouiCount === 0 ? T.hint : ouiCount <= 2 ? "#92400E" : "#065F46",
              borderRadius: 99,
              padding: "0.08rem 0.42rem",
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
            style={{
              width: "100%",
              padding: "0.48rem 0.2rem",
              border: "none",
              borderTop:
                i > 0
                  ? `1px solid ${value === opt.v ? opt.border : T.border}`
                  : "none",
              cursor: "pointer",
              fontFamily: T.font,
              fontWeight: value === opt.v ? 900 : 600,
              fontSize: "0.73rem",
              background: value === opt.v ? opt.bg : "transparent",
              color: value === opt.v ? opt.col : T.muted,
              transition: "all 0.1s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.18rem",
            }}
          >
            <span style={{ fontSize: "0.78rem" }}>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
