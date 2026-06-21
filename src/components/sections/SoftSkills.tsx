import { GoPlusCircle } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import { useCVStore } from "../../state/cvStore";

/**
 * Editor for the Soft Skills section: a flat list of editable skills.
 */
function SoftSkills() {
  const softSkills = useCVStore((state) => state.data.softSkills);
  const addEntry = useCVStore((state) => state.addEntry);
  const updateEntry = useCVStore((state) => state.updateEntry);
  const deleteEntry = useCVStore((state) => state.deleteEntry);

  return (
    <div className="form-section">
      <ul>
        {softSkills.map((entry) => (
          <li key={entry.id}>
            <input
              type="text"
              value={entry.skill}
              placeholder="Soft skill"
              onChange={(e) =>
                updateEntry("softSkills", entry.id, { skill: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => deleteEntry("softSkills", entry.id)}
              aria-label="Delete soft skill"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="buttonInfo add-section-btn"
        onClick={() => addEntry("softSkills")}
      >
        <GoPlusCircle /> Add Soft Skill
      </button>
    </div>
  );
}

export default SoftSkills;
