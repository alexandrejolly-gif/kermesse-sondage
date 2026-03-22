import { T, card, useCompact } from "../styles/theme";

export default function RolesSection({ roles, selected, onChange }) {
  const compact = useCompact();
  const toggle = (id) =>
    onChange(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]
    );

  return (
    <div style={card({ padding: compact ? "0.65rem" : undefined })}>
      <div style={{ marginBottom: compact ? "0.4rem" : "0.75rem" }}>
        <span style={{ fontWeight: 900, fontSize: compact ? "0.82rem" : "0.92rem", color: T.text }}>
          {compact ? "Rôles" : "Préférences de rôles"}
        </span>
        {!compact && (
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: "0.76rem",
              color: T.muted,
              fontWeight: 600,
            }}
          >
            · Cochez un ou plusieurs postes qui vous intéressent
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? "0.35rem" : "0.5rem" }}>
        {roles.map((role) => {
          const on = selected.includes(role.id);
          return (
            <button
              key={role.id}
              onClick={() => toggle(role.id)}
              style={{
                padding: compact ? "0.3rem 0.6rem" : "0.42rem 0.85rem",
                borderRadius: 99,
                border: `2px solid ${on ? T.primary : T.border}`,
                background: on ? T.primaryBg : "white",
                color: on ? T.primaryDk : T.muted,
                fontWeight: on ? 900 : 600,
                fontSize: compact ? "0.72rem" : "0.82rem",
                cursor: "pointer",
                fontFamily: T.font,
                transition: "all 0.12s",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              {on && <span>✓</span>}
              {role.label}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div
          style={{
            marginTop: compact ? "0.35rem" : "0.6rem",
            fontSize: compact ? "0.68rem" : "0.76rem",
            color: T.primary,
            fontWeight: 700,
          }}
        >
          {selected.length} rôle{selected.length > 1 ? "s" : ""} sélectionné
          {selected.length > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
