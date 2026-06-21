import { GoPlusCircle } from "react-icons/go";
import type { Education as EducationEntry } from "../../types/cv";
import { useCVStore } from "../../state/cvStore";
import EntryCard from "./EntryCard";
import { useExpandedSet } from "../../hooks/useExpandedSet";

/**
 * A labelled text/date input for one education field.
 */
interface FieldDef {
  id: keyof EducationEntry;
  label: string;
  type: "text" | "date";
}

const FIELDS: FieldDef[] = [
  { id: "schoolName", label: "School", type: "text" },
  { id: "degreeName", label: "Degree", type: "text" },
  { id: "degreeCity", label: "City", type: "text" },
  { id: "startDate", label: "Start Date", type: "date" },
  { id: "endDate", label: "End Date", type: "date" },
  { id: "extraNotes", label: "Description", type: "text" },
];

/**
 * Editor for the Education section: a collapsible card per school entry.
 */
function Education() {
  const education = useCVStore((state) => state.data.education);
  const addEntry = useCVStore((state) => state.addEntry);
  const updateEntry = useCVStore((state) => state.updateEntry);
  const deleteEntry = useCVStore((state) => state.deleteEntry);
  const { isExpanded, toggle } = useExpandedSet();

  return (
    <div className="form-section">
      {education.map((entry) => (
        <EntryCard
          key={entry.id}
          title={entry.schoolName || "(No School Name)"}
          expanded={isExpanded(entry.id)}
          onToggle={() => toggle(entry.id)}
          onDelete={() => deleteEntry("education", entry.id)}
        >
          {FIELDS.map(({ id, label, type }) => (
            <label key={id}>
              {label}
              <input
                type={type}
                value={entry[id]}
                onChange={(e) =>
                  updateEntry("education", entry.id, { [id]: e.target.value })
                }
              />
            </label>
          ))}
        </EntryCard>
      ))}

      <button
        type="button"
        className="buttonInfo add-section-btn"
        onClick={() => addEntry("education")}
      >
        <GoPlusCircle /> Add Education
      </button>
    </div>
  );
}

export default Education;
