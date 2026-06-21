import { useCVStore } from "../../state/cvStore";
import EntryCard from "./EntryCard";
import { useExpandedSet } from "../../hooks/useExpandedSet";
import BulletEditor from "./BulletEditor";

/**
 * Editor for the Experience section: a collapsible card per role.
 */
function Experience() {
  const experience = useCVStore((state) => state.data.experience);
  const addEntry = useCVStore((state) => state.addEntry);
  const updateEntry = useCVStore((state) => state.updateEntry);
  const deleteEntry = useCVStore((state) => state.deleteEntry);
  const { isExpanded, toggle } = useExpandedSet();

  return (
    <div className="form-section">
      {experience.map((exp) => (
        <EntryCard
          key={exp.id}
          title={exp.jobTitle || exp.companyName || "Untitled Experience"}
          expanded={isExpanded(exp.id)}
          onToggle={() => toggle(exp.id)}
          onDelete={() => deleteEntry("experience", exp.id)}
        >
          <label>
            Job Title
            <input
              type="text"
              value={exp.jobTitle}
              onChange={(e) =>
                updateEntry("experience", exp.id, { jobTitle: e.target.value })
              }
            />
          </label>
          <label>
            Company Name
            <input
              type="text"
              value={exp.companyName}
              onChange={(e) =>
                updateEntry("experience", exp.id, {
                  companyName: e.target.value,
                })
              }
            />
          </label>
          <label>
            From
            <input
              type="date"
              value={exp.fromDate}
              onChange={(e) =>
                updateEntry("experience", exp.id, { fromDate: e.target.value })
              }
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={exp.toDate}
              disabled={exp.current}
              onChange={(e) =>
                updateEntry("experience", exp.id, { toDate: e.target.value })
              }
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={(e) =>
                updateEntry("experience", exp.id, { current: e.target.checked })
              }
            />
            I currently work here
          </label>

          <BulletEditor
            section="experience"
            id={exp.id}
            lines={exp.bullets}
            label="Job Description"
            placeholder="Add job description bullet"
          />
        </EntryCard>
      ))}

      <button
        type="button"
        className="add-section-btn"
        onClick={() => addEntry("experience")}
      >
        Add Experience
      </button>
    </div>
  );
}

export default Experience;
