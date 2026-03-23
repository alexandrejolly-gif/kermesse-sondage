import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import SlotCol from "./SlotCol";
import RolesSection from "./RolesSection";
import { T, OPT, card, inputBase, lbl, errMsg, btn, uid, isEmail, useCompact } from "../styles/theme";

export default function VoteView({ cfg, responses, refreshResponses }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [votes, setVotes] = useState({});
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = new, string = editing existing
  const compact = useCompact();

  // Realtime: listen for changes on responses table
  useEffect(() => {
    const channel = supabase
      .channel("responses-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "responses" },
        () => {
          refreshResponses();
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [refreshResponses]);

  // Check if email already exists and load previous response
  const checkEmail = () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !isEmail(trimmed)) {
      setEditingId(null);
      return;
    }
    const existing = responses.find(
      (r) => r.email.toLowerCase() === trimmed
    );
    if (existing) {
      setEditingId(existing.id);
      setName(existing.name);
      // Restore votes (keep undefined for slots not in votes so UI shows neutral)
      const restoredVotes = {};
      cfg.slots.forEach((s) => {
        if (existing.votes[s.id] && existing.votes[s.id] !== "non") {
          restoredVotes[s.id] = existing.votes[s.id];
        }
      });
      setVotes(restoredVotes);
      setSelectedRoles(existing.roles || []);
      setErrors({});
    } else {
      setEditingId(null);
    }
  };

  const toggle = (slotId, val) => setVotes((v) => ({ ...v, [slotId]: val }));
  const cntOui = (sid) => responses.filter((r) => r.votes[sid] === "oui").length;
  const answeredCount = cfg.slots.filter((s) => votes[s.id]).length;

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Requis.";
    if (!email.trim()) e.email = "Requis.";
    else if (!isEmail(email)) e.email = "Email invalide.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaving(true);

    // Absence de réponse => "non" par défaut
    const finalVotes = {};
    cfg.slots.forEach((s) => {
      finalVotes[s.id] = votes[s.id] || "non";
    });

    let error;
    if (editingId) {
      // Update existing response
      ({ error } = await supabase
        .from("responses")
        .update({
          name: name.trim(),
          votes: finalVotes,
          roles: selectedRoles,
        })
        .eq("id", editingId));
    } else {
      // Insert new response
      ({ error } = await supabase.from("responses").insert({
        id: uid(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        votes: finalVotes,
        roles: selectedRoles,
      }));
    }

    setSaving(false);

    if (error) {
      if (error.code === "23505") {
        setErrors({ email: "Cet email a déjà répondu. Ressaisissez-le pour modifier vos réponses." });
      } else {
        setErrors({ email: "Erreur lors de l'enregistrement. Réessayez." });
      }
      return;
    }

    await refreshResponses();
    setSubmitted(true);
  };

  if (submitted)
    return (
      <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.6rem" }}>🎉</div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 900,
            color: T.primary,
            marginBottom: "0.4rem",
          }}
        >
          Merci !
        </h2>
        <p style={{ color: T.muted, marginBottom: "1.75rem" }}>
          {editingId
            ? "Vos réponses ont bien été mises à jour."
            : "Votre réponse a bien été enregistrée."}
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName("");
            setEmail("");
            setVotes({});
            setSelectedRoles([]);
            setErrors({});
            setEditingId(null);
          }}
          style={btn(T.primary)}
        >
          Soumettre une autre réponse
        </button>
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? "0.4rem" : "0.8rem" }}>
      <div style={card(compact ? { padding: "0.5rem 0.6rem" } : {})}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: compact ? "0.3rem" : "0.75rem",
          }}
        >
          <div>
            <label style={{ ...lbl, fontSize: compact ? "0.62rem" : undefined }}>
              {compact ? "Prénom Nom Parent / Prénom enfant (Classe) *" : "Prénom et nom du parent / Prénom de l'enfant (Classe) *"}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={compact ? "Marie Dupont / Julia (PS)" : "Ex : Marie Dupont / Julia (PS)"}
              style={inputBase(!!errors.name)}
            />
            {errors.name && <p style={errMsg}>{errors.name}</p>}
          </div>
          <div>
            <label style={{ ...lbl, fontSize: compact ? "0.62rem" : undefined }}>Email *</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={checkEmail}
              placeholder="marie@exemple.fr"
              type="email"
              style={inputBase(!!errors.email)}
            />
            {errors.email && <p style={errMsg}>{errors.email}</p>}
            {editingId && (
              <p style={{ color: "#059669", fontSize: compact ? "0.65rem" : "0.74rem", marginTop: "0.22rem", fontWeight: 700 }}>
                ✏️ Réponses retrouvées — modifiez et re-soumettez.
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={card(compact ? { padding: "0.65rem" } : {})}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: compact ? "0.35rem" : "0.55rem",
            flexWrap: "wrap",
            gap: "0.4rem",
          }}
        >
          <span style={{ fontWeight: 900, fontSize: compact ? "0.82rem" : "0.92rem", color: T.text }}>
            📅 Disponibilités
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            {!compact && (
              <span
                style={{ fontSize: "0.72rem", color: T.muted, fontWeight: 600 }}
              >
                Sans réponse = Non
              </span>
            )}
            <span
              style={{
                fontSize: "0.73rem",
                fontWeight: 800,
                color:
                  answeredCount === cfg.slots.length ? "#059669" : T.muted,
              }}
            >
              {answeredCount}/{cfg.slots.length}
            </span>
            <div
              style={{
                width: 48,
                height: 5,
                borderRadius: 99,
                background: T.border,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(answeredCount / cfg.slots.length) * 100}%`,
                  background:
                    answeredCount === cfg.slots.length ? "#059669" : T.primary,
                  borderRadius: 99,
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        </div>
        {!compact && (
          <div
            style={{
              display: "flex",
              gap: "0.6rem",
              marginBottom: "0.6rem",
              flexWrap: "wrap",
            }}
          >
            {OPT.map((o) => (
              <span
                key={o.v}
                style={{
                  fontSize: "0.7rem",
                  color: T.muted,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.18rem",
                }}
              >
                <span style={{ color: o.col, fontWeight: 900 }}>{o.icon}</span>
                {o.label}
              </span>
            ))}
          </div>
        )}
        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "0.4rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: compact ? "0.3rem" : "0.45rem",
              minWidth: "min-content",
            }}
          >
            {cfg.slots.map((slot) => (
              <SlotCol
                key={slot.id}
                slot={slot}
                value={votes[slot.id]}
                onChange={(v) => toggle(slot.id, v)}
                ouiCount={cntOui(slot.id)}
                total={responses.length}
                compact={compact}
              />
            ))}
          </div>
        </div>
      </div>

      {cfg.roles && cfg.roles.length > 0 && (
        <RolesSection
          roles={cfg.roles}
          selected={selectedRoles}
          onChange={setSelectedRoles}
          responses={responses}
        />
      )}

      <button
        onClick={submit}
        disabled={saving}
        style={{
          ...btn(T.primary),
          width: "100%",
          justifyContent: "center",
          padding: compact ? "0.55rem" : "0.72rem",
          fontSize: compact ? "0.8rem" : "0.9rem",
          borderRadius: 11,
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving
          ? "Enregistrement…"
          : editingId
            ? compact ? "✏️ Modifier" : "✏️ Modifier mes disponibilités"
            : compact ? "✓ Soumettre" : "✓ Soumettre mes disponibilités"}
      </button>
    </div>
  );
}
