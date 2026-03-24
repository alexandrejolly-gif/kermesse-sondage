import { useState } from "react";
import { T, FS, FW, inputBase, btn, iconBtn } from "../styles/theme";

export default function EditableItem({ item, onSave, onDelete, onMove, isFirst, isLast, fields }) {
  const [editing, setEditing] = useState(false);
  const [vals, setVals] = useState({});

  const startEdit = () => {
    const v = {};
    fields.forEach((f) => {
      v[f.key] = item[f.key] || "";
    });
    setVals(v);
    setEditing(true);
  };

  const save = () => {
    if (!vals[fields[0].key]?.trim()) return;
    onSave({ ...item, ...vals });
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  if (editing)
    return (
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          alignItems: "center",
          padding: "0.4rem 0.6rem",
          background: T.primaryBg,
          borderRadius: 9,
          border: "1.5px solid #FED7AA",
          flexWrap: "wrap",
        }}
      >
        {fields.map((f) => (
          <input
            key={f.key}
            value={vals[f.key]}
            onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
            style={{ ...inputBase(), flex: f.flex || 1, minWidth: f.minWidth || 80 }}
            autoFocus={f === fields[0]}
          />
        ))}
        <button onClick={save} style={btn("#059669")}>
          ✓
        </button>
        <button onClick={cancel} style={btn(T.muted, true)}>
          Annuler
        </button>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.42rem 0.7rem",
        background: T.surfaceAlt,
        borderRadius: 9,
        border: `1px solid ${T.border}`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
        <button
          onClick={() => onMove(-1)}
          disabled={isFirst}
          style={{
            ...iconBtn(isFirst ? T.hint : T.muted),
            padding: "0.05rem 0.3rem",
            opacity: isFirst ? 0.35 : 1,
          }}
        >
          ↑
        </button>
        <button
          onClick={() => onMove(1)}
          disabled={isLast}
          style={{
            ...iconBtn(isLast ? T.hint : T.muted),
            padding: "0.05rem 0.3rem",
            opacity: isLast ? 0.35 : 1,
          }}
        >
          ↓
        </button>
      </div>
      <span
        onClick={startEdit}
        style={{
          flex: 1,
          fontWeight: FW.bold,
          fontSize: FS.md,
          color: T.text,
          cursor: "pointer",
          padding: "0.1rem 0.25rem",
        }}
      >
        {fields
          .map((f) => item[f.key])
          .filter(Boolean)
          .join(" · ")}
      </span>
      <span
        onClick={startEdit}
        style={{
          fontSize: FS.xs,
          color: T.hint,
          cursor: "pointer",
          marginRight: "0.25rem",
        }}
      >
        ✏️
      </span>
      <button onClick={onDelete} style={iconBtn("#DC2626")}>
        ✕
      </button>
    </div>
  );
}
