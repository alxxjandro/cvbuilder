import { GoPlusCircle } from "react-icons/go";
import { useCVStore } from "../../state/cvStore";
import EntryCard from "./EntryCard";
import { useExpandedSet } from "../../hooks/useExpandedSet";
import BulletEditor from "./BulletEditor";

/**
 * Editor for the Technical Skills section: a collapsible card per group.
 */
function TechnicalSkills() {
  const skillGroups = useCVStore((state) => state.data.skillGroups);
  const addEntry = useCVStore((state) => state.addEntry);
  const updateEntry = useCVStore((state) => state.updateEntry);
  const deleteEntry = useCVStore((state) => state.deleteEntry);
  const { isExpanded, toggle } = useExpandedSet();

  return (
    <div className="form-section">
      {skillGroups.map((group) => (
        <EntryCard
          key={group.id}
          title={group.groupName || "Untitled Skill Group"}
          expanded={isExpanded(group.id)}
          onToggle={() => toggle(group.id)}
          onDelete={() => deleteEntry("skillGroups", group.id)}
        >
          <label>
            Skill Group Name
            <input
              type="text"
              value={group.groupName}
              onChange={(e) =>
                updateEntry("skillGroups", group.id, {
                  groupName: e.target.value,
                })
              }
            />
          </label>

          <BulletEditor
            section="skillGroups"
            id={group.id}
            lines={group.groupValues}
            label="Skills"
            placeholder="Add new skill"
          />
        </EntryCard>
      ))}

      <button
        type="button"
        className="buttonInfo add-section-btn"
        onClick={() => addEntry("skillGroups")}
      >
        <GoPlusCircle /> Add Skill Group
      </button>
    </div>
  );
}

export default TechnicalSkills;
