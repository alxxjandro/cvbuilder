import { useCVStore } from "../../state/cvStore";
import EntryCard from "./EntryCard";
import { useExpandedSet } from "../../hooks/useExpandedSet";
import BulletEditor from "./BulletEditor";

/**
 * Editor for the Projects section: a collapsible card per project.
 */
function Projects() {
  const projects = useCVStore((state) => state.data.projects);
  const addEntry = useCVStore((state) => state.addEntry);
  const updateEntry = useCVStore((state) => state.updateEntry);
  const deleteEntry = useCVStore((state) => state.deleteEntry);
  const { isExpanded, toggle } = useExpandedSet();

  return (
    <div className="form-section">
      {projects.map((project) => (
        <EntryCard
          key={project.id}
          title={project.projectName || "Untitled Project"}
          expanded={isExpanded(project.id)}
          onToggle={() => toggle(project.id)}
          onDelete={() => deleteEntry("projects", project.id)}
        >
          <label>
            Project Name
            <input
              type="text"
              value={project.projectName}
              onChange={(e) =>
                updateEntry("projects", project.id, {
                  projectName: e.target.value,
                })
              }
            />
          </label>
          <label>
            Link
            <input
              type="text"
              value={project.link}
              onChange={(e) =>
                updateEntry("projects", project.id, { link: e.target.value })
              }
            />
          </label>
          <label>
            Date
            <input
              type="date"
              value={project.date}
              onChange={(e) =>
                updateEntry("projects", project.id, { date: e.target.value })
              }
            />
          </label>

          <BulletEditor
            section="projects"
            id={project.id}
            lines={project.bullets}
            label="Description"
            placeholder="Add description bullet"
          />
        </EntryCard>
      ))}

      <button
        type="button"
        className="add-section-btn"
        onClick={() => addEntry("projects")}
      >
        Add Project
      </button>
    </div>
  );
}

export default Projects;
