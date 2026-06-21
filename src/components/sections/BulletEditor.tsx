import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import type { BulletSection } from "../../types/cv";
import { useCVStore } from "../../state/cvStore";

/**
 * Props for the reusable list-of-strings editor.
 */
interface BulletEditorProps {
  section: BulletSection;
  id: string;
  lines: string[];
  label?: string;
  placeholder?: string;
}

/**
 * Editable list of string lines shared by sections whose entries hold an
 * array of text (experience/project bullets, skill-group values). Edits,
 * deletes and additions are dispatched through the store.
 */
function BulletEditor({
  section,
  id,
  lines,
  label,
  placeholder = "Add a line",
}: BulletEditorProps) {
  const addBullet = useCVStore((state) => state.addBullet);
  const updateBullet = useCVStore((state) => state.updateBullet);
  const deleteBullet = useCVStore((state) => state.deleteBullet);
  const [draft, setDraft] = useState("");

  const commitDraft = () => {
    const value = draft.trim();
    if (!value) return;
    addBullet(section, id, value);
    setDraft("");
  };

  return (
    <div className="bullet-editor">
      {label && <strong>{label}</strong>}
      <ul>
        {lines.map((line, index) => (
          <li key={index}>
            <input
              type="text"
              value={line}
              onChange={(e) => updateBullet(section, id, index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => deleteBullet(section, id, index)}
              aria-label="Delete line"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
      <div className="bullet-editor-add">
        <input
          type="text"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitDraft();
          }}
        />
        <button type="button" onClick={commitDraft}>
          Add
        </button>
      </div>
    </div>
  );
}

export default BulletEditor;
