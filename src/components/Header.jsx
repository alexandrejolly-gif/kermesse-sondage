import { T, FS, FW, useCompact } from "../styles/theme";

export default function Header({ cfg, view, setView, respCount }) {
  const compact = useCompact();

  const allTabs = [
    { id: "vote", label: "📝 Répondre" },
    { id: "results", label: `📊 Résultats${respCount > 0 ? ` (${respCount})` : ""}` },
    { id: "admin", label: "⚙️", title: "Administration" },
  ];

  const hasImage = !!cfg?.header_image;

  const tabStyle = (id) => {
    const active = view === id;
    return {
      padding: compact ? "0.28rem 0.6rem" : "0.38rem 0.85rem",
      borderRadius: 99,
      border: "none",
      cursor: "pointer",
      fontFamily: T.font,
      fontWeight: active ? FW.heavy : FW.medium,
      fontSize: compact ? FS.sm : FS.md,
      background: active ? "rgba(255,255,255,0.92)" : "transparent",
      color: active ? T.primaryDk : "rgba(255,255,255,0.8)",
      boxShadow: active ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      whiteSpace: "nowrap",
      flexShrink: 0,
    };
  };

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)",
        boxShadow: "0 4px 20px rgba(249,115,22,0.28)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {hasImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${cfg.header_image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {hasImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(234,88,12,0.78) 0%, rgba(249,115,22,0.72) 50%, rgba(251,146,60,0.68) 100%)",
          }}
        />
      )}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: compact ? "0.6rem 0.7rem 0.6rem" : "1.1rem 1rem 0.85rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          onClick={() => setView("vote")}
          style={{
            fontSize: compact ? FS.lg : FS.xl,
            fontWeight: FW.heavy,
            color: "white",
            lineHeight: 1.2,
            marginBottom: "0.2rem",
            cursor: "pointer",
          }}
        >
          {cfg?.icon || "🎪"} {cfg?.title}
        </h1>
        {cfg?.description && (
          <p
            style={{
              fontSize: compact ? FS.xs : FS.sm,
              fontWeight: FW.medium,
              color: "rgba(255,255,255,0.85)",
              marginBottom: compact ? "0.5rem" : "0.75rem",
            }}
          >
            {cfg.description}
          </p>
        )}
        <nav
          style={{
            display: "inline-flex",
            gap: "0.2rem",
            padding: "0.2rem",
            background: "rgba(0,0,0,0.15)",
            borderRadius: 99,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {allTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              title={t.title}
              style={tabStyle(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
