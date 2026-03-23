import { T, card, optFor, useCompact } from "../styles/theme";

export default function ResultsView({ cfg, responses }) {
  const compact = useCompact();

  if (responses.length === 0)
    return (
      <div style={{ ...card(), textAlign: "center", padding: "2.5rem" }}>
        <div style={{ fontSize: "2.2rem", marginBottom: "0.6rem" }}>📭</div>
        <p style={{ fontWeight: 700, color: T.muted }}>
          Aucune réponse pour l'instant.
        </p>
      </div>
    );

  const cnt = (sid, val) =>
    responses.filter((r) => r.votes[sid] === val).length;
  const roleCnt = (rid) =>
    responses.filter((r) => (r.roles || []).includes(rid)).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? "0.5rem" : "1rem" }}>
      {/* Availability table */}
      <div style={{ ...card({ padding: 0 }), overflow: "hidden" }}>
        <div
          style={{
            padding: "0.65rem 1rem",
            borderBottom: `1px solid ${T.border}`,
            fontWeight: 900,
            fontSize: "0.88rem",
          }}
        >
          📅 Disponibilités
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: compact ? "0.72rem" : "0.82rem",
            }}
          >
            <thead>
              <tr style={{ background: T.primaryBg }}>
                <th
                  style={{
                    padding: compact ? "0.45rem 0.5rem" : "0.7rem 1rem",
                    textAlign: "left",
                    fontWeight: 900,
                    borderBottom: `1px solid ${T.border}`,
                    minWidth: compact ? 90 : 160,
                    position: "sticky",
                    left: 0,
                    background: T.primaryBg,
                    zIndex: 1,
                  }}
                >
                  Participant·e
                </th>
                {cfg.slots.map((s) => (
                  <th
                    key={s.id}
                    style={{
                      padding: compact ? "0.35rem 0.25rem" : "0.55rem",
                      textAlign: "center",
                      fontWeight: 800,
                      borderBottom: `1px solid ${T.border}`,
                      minWidth: compact ? 65 : 100,
                      borderLeft: `1px solid ${T.border}`,
                      fontSize: compact ? "0.62rem" : "0.75rem",
                    }}
                  >
                    <div>{s.label}</div>
                    {s.sub && <div style={{ color: T.primary }}>{s.sub}</div>}
                  </th>
                ))}
              </tr>
              <tr style={{ background: "#FEF9C3" }}>
                <td
                  style={{
                    padding: compact ? "0.22rem 0.5rem" : "0.32rem 1rem",
                    fontWeight: 700,
                    fontSize: compact ? "0.62rem" : "0.73rem",
                    color: T.muted,
                    borderBottom: `1px solid ${T.border}`,
                    position: "sticky",
                    left: 0,
                    background: "#FEF9C3",
                    zIndex: 1,
                  }}
                >
                  ✓ Disponibles
                </td>
                {cfg.slots.map((s) => (
                  <td
                    key={s.id}
                    style={{
                      padding: compact ? "0.2rem 0.2rem" : "0.32rem 0.35rem",
                      textAlign: "center",
                      borderBottom: `1px solid ${T.border}`,
                      borderLeft: `1px solid ${T.border}`,
                    }}
                  >
                    <span
                      style={{
                        background: "#D1FAE5",
                        color: "#065F46",
                        fontWeight: 900,
                        borderRadius: 99,
                        padding: compact ? "0.04rem 0.3rem" : "0.08rem 0.45rem",
                        fontSize: compact ? "0.65rem" : "0.75rem",
                      }}
                    >
                      {cnt(s.id, "oui")}
                    </span>
                    {cnt(s.id, "peut") > 0 && (
                      <span
                        style={{
                          background: "#FEF3C7",
                          color: "#92400E",
                          fontWeight: 800,
                          borderRadius: 99,
                          padding: compact ? "0.04rem 0.28rem" : "0.08rem 0.4rem",
                          fontSize: compact ? "0.6rem" : "0.72rem",
                          marginLeft: 3,
                        }}
                      >
                        ~{cnt(s.id, "peut")}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((r, i) => (
                <tr
                  key={r.id}
                  style={{
                    background: i % 2 === 0 ? "white" : T.surfaceAlt,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  <td
                    style={{
                      padding: compact ? "0.35rem 0.5rem" : "0.6rem 1rem",
                      fontWeight: 700,
                      position: "sticky",
                      left: 0,
                      background: i % 2 === 0 ? "white" : T.surfaceAlt,
                      zIndex: 1,
                    }}
                  >
                    {r.name}
                  </td>
                  {cfg.slots.map((s) => {
                    const opt = optFor(r.votes[s.id]);
                    return (
                      <td
                        key={s.id}
                        style={{
                          padding: compact ? "0.25rem 0.2rem" : "0.4rem 0.3rem",
                          textAlign: "center",
                          borderLeft: `1px solid ${T.border}`,
                        }}
                      >
                        {opt ? (
                          <span
                            style={{
                              background: opt.bg,
                              color: opt.col,
                              fontWeight: 800,
                              borderRadius: 5,
                              padding: compact ? "0.08rem 0.3rem" : "0.12rem 0.45rem",
                              fontSize: compact ? "0.66rem" : "0.76rem",
                              display: "inline-block",
                            }}
                          >
                            {opt.icon}
                          </span>
                        ) : (
                          <span style={{ color: T.hint }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles table */}
      {cfg.roles && cfg.roles.length > 0 && (
        <div style={{ ...card({ padding: 0 }), overflow: "hidden" }}>
          <div
            style={{
              padding: "0.65rem 1rem",
              borderBottom: `1px solid ${T.border}`,
              fontWeight: 900,
              fontSize: "0.88rem",
            }}
          >
            🎭 Préférences de rôles
          </div>
          <div
            style={{
              padding: compact ? "0.5rem 0.65rem" : "0.75rem 1rem",
              display: "flex",
              flexWrap: "wrap",
              gap: compact ? "0.3rem" : "0.45rem",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            {cfg.roles.map((role) => {
              const n = roleCnt(role.id);
              return (
                <div
                  key={role.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: compact ? "0.25rem" : "0.35rem",
                    background: n > 0 ? T.primaryBg : T.surfaceAlt,
                    border: `1px solid ${n > 0 ? "#FED7AA" : T.border}`,
                    borderRadius: 99,
                    padding: compact ? "0.18rem 0.5rem" : "0.28rem 0.7rem",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: compact ? "0.65rem" : "0.78rem",
                      color: n > 0 ? T.primaryDk : T.muted,
                    }}
                  >
                    {role.label}
                  </span>
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: compact ? "0.62rem" : "0.75rem",
                      background: n > 0 ? T.primary : T.border,
                      color: n > 0 ? "white" : T.muted,
                      borderRadius: 99,
                      padding: compact ? "0.02rem 0.32rem" : "0.05rem 0.42rem",
                      minWidth: compact ? 16 : 18,
                      textAlign: "center",
                    }}
                  >
                    {n}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: compact ? "0.72rem" : "0.82rem",
              }}
            >
              <thead>
                <tr style={{ background: T.primaryBg }}>
                  <th
                    style={{
                      padding: compact ? "0.4rem 0.5rem" : "0.65rem 1rem",
                      textAlign: "left",
                      fontWeight: 900,
                      borderBottom: `1px solid ${T.border}`,
                      minWidth: compact ? 90 : 160,
                      position: "sticky",
                      left: 0,
                      background: T.primaryBg,
                      zIndex: 1,
                    }}
                  >
                    Participant·e
                  </th>
                  {cfg.roles.map((ro) => (
                    <th
                      key={ro.id}
                      style={{
                        padding: compact ? "0.35rem 0.25rem" : "0.55rem 0.5rem",
                        textAlign: "center",
                        fontWeight: 800,
                        borderBottom: `1px solid ${T.border}`,
                        minWidth: compact ? 60 : 90,
                        borderLeft: `1px solid ${T.border}`,
                        fontSize: compact ? "0.62rem" : "0.75rem",
                      }}
                    >
                      {ro.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((r, i) => (
                  <tr
                    key={r.id}
                    style={{
                      background: i % 2 === 0 ? "white" : T.surfaceAlt,
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    <td
                      style={{
                        padding: compact ? "0.35rem 0.5rem" : "0.55rem 1rem",
                        fontWeight: 700,
                        position: "sticky",
                        left: 0,
                        background: i % 2 === 0 ? "white" : T.surfaceAlt,
                        zIndex: 1,
                      }}
                    >
                      {r.name}
                    </td>
                    {cfg.roles.map((ro) => {
                      const on = (r.roles || []).includes(ro.id);
                      return (
                        <td
                          key={ro.id}
                          style={{
                            padding: compact ? "0.25rem 0.2rem" : "0.4rem 0.3rem",
                            textAlign: "center",
                            borderLeft: `1px solid ${T.border}`,
                          }}
                        >
                          {on ? (
                            <span style={{ color: "#059669", fontWeight: 900 }}>
                              ✓
                            </span>
                          ) : (
                            <span style={{ color: T.border }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
