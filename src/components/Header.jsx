import { T } from "../styles/theme";

export default function Header({ cfg, view, setView, respCount }) {
  const tabs = [
    { id: "vote", label: "📝 Répondre" },
    { id: "results", label: `📊 Résultats${respCount > 0 ? ` (${respCount})` : ""}` },
    { id: "admin", label: "⚙️ Admin" },
  ];

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
        boxShadow: "0 4px 20px rgba(249,115,22,0.28)",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.1rem 1rem 0" }}>
        <h1
          style={{
            fontSize: "clamp(1.15rem, 4vw, 1.5rem)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.2,
            marginBottom: "0.2rem",
          }}
        >
          🎪 {cfg?.title}
        </h1>
        {cfg?.description && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.85)",
              marginBottom: "0.75rem",
            }}
          >
            {cfg.description}
          </p>
        )}
        <nav style={{ display: "flex", gap: "0.2rem", overflowX: "auto" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              style={{
                padding: "0.38rem 0.85rem",
                borderRadius: "7px 7px 0 0",
                border: "none",
                cursor: "pointer",
                fontFamily: T.font,
                fontWeight: view === t.id ? 900 : 600,
                fontSize: "0.8rem",
                background: view === t.id ? T.bg : "rgba(255,255,255,0.22)",
                color: view === t.id ? T.primary : "white",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
