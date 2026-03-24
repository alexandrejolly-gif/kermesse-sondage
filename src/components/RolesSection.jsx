import { T, FS, FW, card, useCompact } from "../styles/theme";

export default function RolesSection({ roles, selected, onChange, responses }) {
  const compact = useCompact();
  const toggle = (id) =>
    onChange(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]
    );
  const roleCnt = (rid) =>
    (responses || []).filter((r) => (r.roles || []).includes(rid)).length;

  return (
    <div style={card(compact ? { padding: "0.65rem" } : {})}>
      <div style={{ marginBottom: compact ? "0.35rem" : "0.5rem" }}>
        <span style={{ fontWeight: FW.bold, fontSize: compact ? FS.md : FS.lg, color: T.text }}>
          🎭 Préférences de rôles
        </span>
        {!compact && (
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: FS.sm,
              color: T.muted,
              fontWeight: FW.medium,
            }}
          >
            · Cochez un ou plusieurs postes qui vous intéressent
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? "0.35rem" : "0.5rem" }}>
        {roles.map((role) => {
          const on = selected.includes(role.id);
          const count = roleCnt(role.id);
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
                fontWeight: on ? FW.bold : FW.medium,
                fontSize: compact ? FS.sm : FS.md,
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
              <span style={{ fontSize: compact ? FS.xs : FS.sm, color: on ? T.primary : T.hint, fontWeight: FW.bold }}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
