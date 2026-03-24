import { useState, useRef, useEffect } from "react";
import { T, FS, FW, card, optFor, useCompact } from "../styles/theme";

function VoteIcon({ vote, size = 16 }) {
  const opt = optFor(vote);
  if (!opt) return <span style={{ color: T.hint }}>—</span>;

  const strokeWidth = 2.5;
  const paths = {
    oui: <path d="M3 8.5L6.5 12L13 4" stroke={opt.col} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    peut: <path d="M3 8H13" stroke={opt.col} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />,
    non: <><path d="M4 4L12 12" stroke={opt.col} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" /><path d="M12 4L4 12" stroke={opt.col} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" /></>,
  };

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size + 12,
      height: size + 12,
      borderRadius: 6,
      background: opt.bg,
      border: opt.v === "peut" ? `1.5px dashed ${opt.border}` : "none",
    }}>
      <svg width={size} height={size} viewBox="0 0 16 16">{paths[vote]}</svg>
    </span>
  );
}

export default function ResultsView({ cfg, responses }) {
  const compact = useCompact();
  const [hoveredRow, setHoveredRow] = useState(null);
  const headerRowRef = useRef(null);
  const [headerH, setHeaderH] = useState(0);
  const scrollable = responses.length > 10;

  useEffect(() => {
    if (headerRowRef.current) setHeaderH(headerRowRef.current.offsetHeight);
  }, [responses.length, compact]);

  if (responses.length === 0)
    return (
      <div style={{ ...card(), textAlign: "center", padding: "2.5rem" }}>
        <div style={{ fontSize: "2.2rem", marginBottom: "0.6rem" }}>📭</div>
        <p style={{ fontWeight: FW.bold, color: T.muted }}>
          Aucune réponse pour l'instant.
        </p>
      </div>
    );

  const cnt = (sid, val) =>
    responses.filter((r) => r.votes[sid] === val).length;
  const roleCnt = (rid) =>
    responses.filter((r) => (r.roles || []).includes(rid)).length;

  const rowBg = (id, i) =>
    hoveredRow === id
      ? T.primaryBg
      : i % 2 === 0 ? "white" : T.surfaceAlt;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? "0.5rem" : "1rem" }}>
      {/* Availability table */}
      <div style={{ ...card({ padding: 0 }), overflow: "hidden" }}>
        <div
          style={{
            padding: "0.65rem 1rem",
            borderBottom: `1px solid ${T.border}`,
            fontWeight: FW.bold,
            fontSize: FS.lg,
          }}
        >
          📅 Disponibilités
        </div>
        <div style={{ overflowX: "auto", ...(scrollable && { maxHeight: compact ? 420 : 520, overflowY: "auto" }) }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: compact ? FS.sm : FS.md,
            }}
          >
            <thead>
              <tr ref={headerRowRef} style={{ background: T.primaryBg, ...(scrollable && { position: "sticky", top: 0, zIndex: 3 }) }}>
                <th
                  style={{
                    padding: compact ? "0.45rem 0.5rem" : "0.7rem 1rem",
                    textAlign: "left",
                    fontWeight: FW.bold,
                    borderBottom: `1px solid ${T.border}`,
                    minWidth: compact ? 90 : 160,
                    position: "sticky",
                    left: 0,
                    background: T.primaryBg,
                    zIndex: 4,
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
                      fontWeight: FW.bold,
                      borderBottom: `1px solid ${T.border}`,
                      minWidth: compact ? 65 : 100,
                      borderLeft: `1px solid ${T.border}`,
                      fontSize: compact ? FS.xs : FS.sm,
                    }}
                  >
                    <div>{s.label}</div>
                    {s.sub && <div style={{ color: T.primary }}>{s.sub}</div>}
                  </th>
                ))}
              </tr>
              <tr style={{ background: "#FEF9C3", ...(scrollable && { position: "sticky", top: headerH, zIndex: 3 }) }}>
                <td
                  style={{
                    padding: compact ? "0.22rem 0.5rem" : "0.32rem 1rem",
                    fontWeight: FW.bold,
                    fontSize: compact ? FS.xs : FS.sm,
                    color: T.muted,
                    borderBottom: `1px solid ${T.border}`,
                    position: "sticky",
                    left: 0,
                    background: "#FEF9C3",
                    zIndex: 4,
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
                        fontWeight: FW.heavy,
                        borderRadius: 99,
                        padding: compact ? "0.04rem 0.3rem" : "0.08rem 0.45rem",
                        fontSize: compact ? FS.xs : FS.sm,
                      }}
                    >
                      {cnt(s.id, "oui")}
                    </span>
                    {cnt(s.id, "peut") > 0 && (
                      <span
                        style={{
                          background: "#FEF3C7",
                          color: "#92400E",
                          fontWeight: FW.heavy,
                          borderRadius: 99,
                          padding: compact ? "0.04rem 0.28rem" : "0.08rem 0.4rem",
                          fontSize: compact ? FS.xs : FS.sm,
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
                  onMouseEnter={() => setHoveredRow(r.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: rowBg(r.id, i),
                    borderBottom: `1px solid ${T.border}`,
                    transition: "background 0.15s ease",
                  }}
                >
                  <td
                    title={r.name}
                    style={{
                      padding: compact ? "0.35rem 0.5rem" : "0.6rem 1rem",
                      fontWeight: FW.bold,
                      position: "sticky",
                      left: 0,
                      background: rowBg(r.id, i),
                      zIndex: 1,
                      maxWidth: compact ? 110 : 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      transition: "background 0.15s ease",
                    }}
                  >
                    {r.name}
                  </td>
                  {cfg.slots.map((s) => (
                    <td
                      key={s.id}
                      style={{
                        padding: compact ? "0.25rem 0.2rem" : "0.4rem 0.3rem",
                        textAlign: "center",
                        borderLeft: `1px solid ${T.border}`,
                      }}
                    >
                      <VoteIcon vote={r.votes[s.id]} size={compact ? 14 : 16} />
                    </td>
                  ))}
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
              fontWeight: FW.bold,
              fontSize: FS.lg,
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
                      fontWeight: FW.heavy,
                      fontSize: compact ? FS.xs : FS.sm,
                      color: n > 0 ? T.primaryDk : T.muted,
                    }}
                  >
                    {role.label}
                  </span>
                  <span
                    style={{
                      fontWeight: FW.heavy,
                      fontSize: compact ? FS.xs : FS.sm,
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
          <div style={{ overflowX: "auto", ...(scrollable && { maxHeight: compact ? 420 : 520, overflowY: "auto" }) }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: compact ? FS.sm : FS.md,
              }}
            >
              <thead>
                <tr style={{ background: T.primaryBg, ...(scrollable && { position: "sticky", top: 0, zIndex: 3 }) }}>
                  <th
                    style={{
                      padding: compact ? "0.4rem 0.5rem" : "0.65rem 1rem",
                      textAlign: "left",
                      fontWeight: FW.bold,
                      borderBottom: `1px solid ${T.border}`,
                      minWidth: compact ? 90 : 160,
                      position: "sticky",
                      left: 0,
                      background: T.primaryBg,
                      zIndex: 4,
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
                        fontWeight: FW.bold,
                        borderBottom: `1px solid ${T.border}`,
                        minWidth: compact ? 60 : 90,
                        borderLeft: `1px solid ${T.border}`,
                        fontSize: compact ? FS.xs : FS.sm,
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
                    onMouseEnter={() => setHoveredRow(r.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: rowBg(r.id, i),
                      borderBottom: `1px solid ${T.border}`,
                      transition: "background 0.15s ease",
                    }}
                  >
                    <td
                      title={r.name}
                      style={{
                        padding: compact ? "0.35rem 0.5rem" : "0.55rem 1rem",
                        fontWeight: FW.bold,
                        position: "sticky",
                        left: 0,
                        background: rowBg(r.id, i),
                        zIndex: 1,
                        maxWidth: compact ? 110 : 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        transition: "background 0.15s ease",
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
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              width: compact ? 22 : 26, height: compact ? 22 : 26,
                              borderRadius: 6, background: "#D1FAE5",
                            }}>
                              <svg width={compact ? 12 : 14} height={compact ? 12 : 14} viewBox="0 0 16 16">
                                <path d="M3 8.5L6.5 12L13 4" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                              </svg>
                            </span>
                          ) : (
                            <span style={{ color: T.hint, fontSize: compact ? "0.7rem" : "0.82rem" }}>—</span>
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
