import { useState, useEffect } from "react";
import EditableItem from "./EditableItem";
import {
  T,
  FS,
  FW,
  card,
  inputBase,
  lbl,
  errMsg,
  btn,
  iconBtn,
  uid,
  move,
  optFor,
  downloadCSV,
  useCompact,
} from "../styles/theme";

export default function AdminView({ cfg, responses, saveCfg, deleteResponse, resetResponses }) {
  const compact = useCompact();
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [tab, setTab] = useState("slots");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [slots, setSlots] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newSlotLabel, setNewSlotLabel] = useState("");
  const [newSlotSub, setNewSlotSub] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (unlocked && cfg) {
      setTitle(cfg.title);
      setDesc(cfg.description);
      setSlots([...cfg.slots]);
      setRoles([...(cfg.roles || [])]);
    }
  }, [unlocked, cfg]);

  const unlock = () => {
    if (pwd === cfg.admin_password) {
      setUnlocked(true);
      setPwdErr("");
    } else {
      setPwdErr("Mot de passe incorrect.");
    }
  };

  const addSlot = () => {
    if (!newSlotLabel.trim()) return;
    setSlots((s) => [
      ...s,
      { id: uid(), label: newSlotLabel.trim(), sub: newSlotSub.trim() },
    ]);
    setNewSlotLabel("");
    setNewSlotSub("");
  };

  const addRole = () => {
    if (!newRole.trim()) return;
    setRoles((r) => [...r, { id: uid(), label: newRole.trim() }]);
    setNewRole("");
  };

  const saveAll = async () => {
    await saveCfg({
      title: title.trim() || cfg.title,
      description: desc,
      slots,
      roles,
      admin_password: newPwd.trim() || cfg.admin_password,
    });
    if (newPwd.trim()) setNewPwd("");
    setFlash("✓ Enregistré !");
    setTimeout(() => setFlash(""), 2500);
  };

  if (!unlocked)
    return (
      <div style={{ maxWidth: 400, margin: "2rem auto", ...card() }}>
        <h2
          style={{ fontWeight: FW.bold, fontSize: FS.lg, marginBottom: "0.4rem" }}
        >
          🔒 Administration
        </h2>
        <label style={{ ...lbl, marginTop: "0.5rem" }}>Mot de passe</label>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && unlock()}
          placeholder="••••••••••"
          style={inputBase(!!pwdErr)}
        />
        {pwdErr && <p style={errMsg}>{pwdErr}</p>}
        <button
          onClick={unlock}
          style={{
            ...btn(T.primary),
            width: "100%",
            justifyContent: "center",
            marginTop: "0.9rem",
          }}
        >
          Déverrouiller
        </button>
      </div>
    );

  const adminTabs = [
    { id: "slots", label: compact ? "Créneaux" : "📅 Créneaux" },
    { id: "roles", label: compact ? "Rôles" : "🎭 Rôles" },
    { id: "general", label: compact ? "Général" : "⚙️ Général" },
    { id: "responses", label: compact ? `Rép. (${responses.length})` : `👥 Réponses (${responses.length})` },
  ];

  return (
    <div>
      {flash && (
        <div
          style={{
            background: "#D1FAE5",
            color: "#065F46",
            fontWeight: FW.heavy,
            fontSize: FS.md,
            padding: "0.5rem 0.8rem",
            borderRadius: 9,
            marginBottom: "0.9rem",
          }}
        >
          {flash}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: compact ? "0.3rem" : "0.4rem",
          marginBottom: compact ? "0.6rem" : "1rem",
          padding: compact ? "0.25rem" : "0.3rem",
          background: T.surfaceAlt,
          borderRadius: 10,
          border: `1px solid ${T.border}`,
        }}
      >
        {adminTabs.map(({ id, label: l2 }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: compact ? "0.32rem 0.55rem" : "0.42rem 0.85rem",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontFamily: T.font,
                fontWeight: active ? FW.heavy : FW.medium,
                fontSize: compact ? FS.sm : FS.md,
                background: active ? "white" : "transparent",
                color: active ? T.primaryDk : T.muted,
                boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {l2}
            </button>
          );
        })}
      </div>

      {/* Slots tab */}
      {tab === "slots" && (
        <div style={card()}>
          <h3
            style={{
              fontWeight: FW.bold,
              fontSize: FS.lg,
              marginBottom: "0.5rem",
            }}
          >
            Créneaux horaires
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              marginBottom: "0.9rem",
            }}
          >
            {slots.length === 0 && (
              <p
                style={{
                  color: T.hint,
                  fontSize: FS.md,
                  fontStyle: "italic",
                }}
              >
                Aucun créneau.
              </p>
            )}
            {slots.map((s, i) => (
              <EditableItem
                key={s.id}
                item={s}
                isFirst={i === 0}
                isLast={i === slots.length - 1}
                fields={[
                  {
                    key: "label",
                    placeholder: "Samedi 14 juin",
                    flex: 2,
                    minWidth: 120,
                  },
                  {
                    key: "sub",
                    placeholder: "10h–12h",
                    flex: 1,
                    minWidth: 70,
                  },
                ]}
                onSave={(u) =>
                  setSlots((sl) => sl.map((x) => (x.id === u.id ? u : x)))
                }
                onDelete={() =>
                  setSlots((sl) => sl.filter((x) => x.id !== s.id))
                }
                onMove={(dir) => setSlots((sl) => move(sl, i, dir))}
              />
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "0.45rem",
              alignItems: "end",
            }}
          >
            <div>
              <label style={lbl}>Date / intitulé</label>
              <input
                value={newSlotLabel}
                onChange={(e) => setNewSlotLabel(e.target.value)}
                placeholder="Samedi 14 juin"
                onKeyDown={(e) => e.key === "Enter" && addSlot()}
                style={inputBase()}
              />
            </div>
            <div>
              <label style={lbl}>Horaire</label>
              <input
                value={newSlotSub}
                onChange={(e) => setNewSlotSub(e.target.value)}
                placeholder="10h–12h"
                onKeyDown={(e) => e.key === "Enter" && addSlot()}
                style={inputBase()}
              />
            </div>
            <button onClick={addSlot} style={{ ...btn(T.primary), alignSelf: "end" }}>
              + Ajouter
            </button>
          </div>
          <button
            onClick={saveAll}
            style={{
              ...btn(T.primary),
              width: "100%",
              justifyContent: "center",
              padding: "0.65rem",
              marginTop: "1.1rem",
            }}
          >
            💾 Enregistrer
          </button>
        </div>
      )}

      {/* Roles tab */}
      {tab === "roles" && (
        <div style={card()}>
          <h3
            style={{
              fontWeight: FW.bold,
              fontSize: FS.lg,
              marginBottom: "0.5rem",
            }}
          >
            Rôles disponibles
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              marginBottom: "0.9rem",
            }}
          >
            {roles.length === 0 && (
              <p
                style={{
                  color: T.hint,
                  fontSize: FS.md,
                  fontStyle: "italic",
                }}
              >
                Aucun rôle.
              </p>
            )}
            {roles.map((r, i) => (
              <EditableItem
                key={r.id}
                item={r}
                isFirst={i === 0}
                isLast={i === roles.length - 1}
                fields={[
                  {
                    key: "label",
                    placeholder: "Buvette",
                    flex: 1,
                    minWidth: 120,
                  },
                ]}
                onSave={(u) =>
                  setRoles((rl) => rl.map((x) => (x.id === u.id ? u : x)))
                }
                onDelete={() =>
                  setRoles((rl) => rl.filter((x) => x.id !== r.id))
                }
                onMove={(dir) => setRoles((rl) => move(rl, i, dir))}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.45rem" }}>
            <input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Ex : Buvette"
              onKeyDown={(e) => e.key === "Enter" && addRole()}
              style={{ ...inputBase(), flex: 1 }}
            />
            <button onClick={addRole} style={btn(T.primary)}>
              + Ajouter
            </button>
          </div>
          <button
            onClick={saveAll}
            style={{
              ...btn(T.primary),
              width: "100%",
              justifyContent: "center",
              padding: "0.65rem",
              marginTop: "1.1rem",
            }}
          >
            💾 Enregistrer
          </button>
        </div>
      )}

      {/* General tab */}
      {tab === "general" && (
        <div style={card()}>
          <h3
            style={{
              fontWeight: FW.bold,
              fontSize: FS.lg,
              marginBottom: "0.5rem",
            }}
          >
            Paramètres généraux
          </h3>
          <div style={{ marginBottom: "0.8rem" }}>
            <label style={lbl}>Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputBase()}
            />
          </div>
          <div style={{ marginBottom: "0.8rem" }}>
            <label style={lbl}>Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              style={{ ...inputBase(), resize: "vertical" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={lbl}>Nouveau mot de passe admin</label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="Laisser vide pour conserver l'actuel"
              style={inputBase()}
            />
          </div>
          <button
            onClick={saveAll}
            style={{
              ...btn(T.primary),
              width: "100%",
              justifyContent: "center",
              padding: "0.65rem",
            }}
          >
            💾 Enregistrer
          </button>
        </div>
      )}

      {/* Responses tab */}
      {tab === "responses" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "0.85rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => downloadCSV(cfg, responses)}
              style={btn("#059669")}
            >
              📥 Exporter CSV
            </button>
            <button
              onClick={async () => {
                if (window.confirm("Supprimer toutes les réponses ?")) {
                  await resetResponses();
                }
              }}
              style={btn("#DC2626")}
            >
              🗑 Tout supprimer
            </button>
          </div>
          {responses.length === 0 ? (
            <div
              style={{
                ...card(),
                textAlign: "center",
                color: T.muted,
                padding: "2rem",
              }}
            >
              Aucune réponse.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem",
              }}
            >
              {[...responses].reverse().map((r) => (
                <div
                  key={r.id}
                  style={{
                    ...card(),
                    padding: "0.85rem 1rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.45rem",
                        flexWrap: "wrap",
                        marginBottom: "0.1rem",
                      }}
                    >
                      <span style={{ fontWeight: FW.heavy, fontSize: FS.md }}>
                        {r.name}
                      </span>
                      <span
                        style={{ fontSize: FS.xs, color: T.hint }}
                      >
                        {r.email} ·{" "}
                        {new Date(r.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.22rem",
                        marginTop: "0.3rem",
                      }}
                    >
                      {cfg.slots.map((s) => {
                        const opt = optFor(r.votes[s.id]);
                        if (!opt || opt.v === "non") return null;
                        return (
                          <span
                            key={s.id}
                            style={{
                              fontSize: FS.xs,
                              background: opt.bg,
                              color: opt.col,
                              fontWeight: FW.heavy,
                              borderRadius: 99,
                              padding: "0.06rem 0.42rem",
                            }}
                          >
                            {s.label}
                            {s.sub ? " " + s.sub : ""} {opt.icon}
                          </span>
                        );
                      })}
                    </div>
                    {(r.roles || []).length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.22rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        {(r.roles || []).map((rid) => {
                          const ro = (cfg.roles || []).find(
                            (x) => x.id === rid
                          );
                          return ro ? (
                            <span
                              key={rid}
                              style={{
                                fontSize: FS.xs,
                                background: T.primaryBg,
                                color: T.primaryDk,
                                fontWeight: FW.heavy,
                                borderRadius: 99,
                                padding: "0.06rem 0.42rem",
                              }}
                            >
                              🎭 {ro.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteResponse(r.id)}
                    style={{ ...iconBtn("#DC2626"), flexShrink: 0 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
