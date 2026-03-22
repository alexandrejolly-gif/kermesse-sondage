import { useState, useEffect } from "react";

// Returns true when viewport <= 420px
export function useCompact() {
  const [compact, setCompact] = useState(() => window.innerWidth <= 420);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 420px)");
    const handler = (e) => setCompact(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return compact;
}

export const T = {
  bg: "#FFFBF0",
  surface: "#FFFFFF",
  surfaceAlt: "#FAFAF7",
  border: "#E7E5E0",
  text: "#1C1917",
  muted: "#78716C",
  hint: "#A8A29E",
  primary: "#F97316",
  primaryDk: "#C2410C",
  primaryBg: "#FFF7ED",
  font: "'Nunito', sans-serif",
};

export const OPT = [
  { v: "oui",  icon: "\u2713", label: "Oui",      col: "#059669", bg: "#D1FAE5", border: "#6EE7B7", light: "#F0FDF4" },
  { v: "peut", icon: "~",      label: "Peut-\u00eatre", col: "#B45309", bg: "#FEF3C7", border: "#FCD34D", light: "#FFFBEB" },
  { v: "non",  icon: "\u2717", label: "Non",       col: "#DC2626", bg: "#FEE2E2", border: "#FCA5A5", light: "#FFF5F5" },
];

export const optFor = (v) => OPT.find((o) => o.v === v);

export const card = (extra = {}) => ({
  background: T.surface,
  borderRadius: 14,
  border: `1px solid ${T.border}`,
  padding: "1.1rem",
  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  ...extra,
});

export const inputBase = (err) => ({
  width: "100%",
  padding: "0.52rem 0.75rem",
  borderRadius: 9,
  border: `1.5px solid ${err ? "#FCA5A5" : T.border}`,
  fontFamily: T.font,
  fontSize: "0.86rem",
  color: T.text,
  background: "white",
  outline: "none",
  boxSizing: "border-box",
});

export const lbl = {
  display: "block",
  fontWeight: 700,
  fontSize: "0.76rem",
  color: T.muted,
  marginBottom: "0.22rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

export const errMsg = {
  color: "#DC2626",
  fontSize: "0.74rem",
  marginTop: "0.22rem",
  fontWeight: 700,
};

export const btn = (bg = T.primary, light = false) => ({
  padding: "0.48rem 0.95rem",
  borderRadius: 9,
  border: light ? `1.5px solid ${T.border}` : "none",
  cursor: "pointer",
  background: light ? "white" : bg,
  color: light ? T.text : "white",
  fontWeight: 800,
  fontFamily: T.font,
  fontSize: "0.83rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.28rem",
  whiteSpace: "nowrap",
});

export const iconBtn = (color = T.muted) => ({
  background: "none",
  border: `1px solid ${T.border}`,
  borderRadius: 7,
  padding: "0.22rem 0.42rem",
  cursor: "pointer",
  color,
  fontWeight: 900,
  fontSize: "0.82rem",
  fontFamily: T.font,
  lineHeight: 1.2,
});

export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const move = (arr, i, dir) => {
  const a = [...arr];
  const j = i + dir;
  if (j < 0 || j >= a.length) return a;
  [a[i], a[j]] = [a[j], a[i]];
  return a;
};

export function buildCSV(cfg, responses) {
  const slotHeaders = cfg.slots.map((s) => `${s.label}${s.sub ? " " + s.sub : ""}`);
  const roleHeaders = cfg.roles.map((r) => `R\u00f4le: ${r.label}`);
  const header = ["Nom / Enfant", "Email", "Date", ...slotHeaders, ...roleHeaders];
  const rows = responses.map((r) => [
    r.name,
    r.email,
    new Date(r.created_at).toLocaleDateString("fr-FR"),
    ...cfg.slots.map((s) => ({ oui: "Oui", peut: "Peut-\u00eatre", non: "Non" }[r.votes[s.id]] || "Non")),
    ...cfg.roles.map((ro) => (r.roles || []).includes(ro.id) ? "\u2713" : ""),
  ]);
  return [header, ...rows]
    .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
    .join("\n");
}

export function downloadCSV(cfg, responses) {
  const blob = new Blob(["\uFEFF" + buildCSV(cfg, responses)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "disponibilites_kermesse.csv";
  a.click();
  URL.revokeObjectURL(url);
}
