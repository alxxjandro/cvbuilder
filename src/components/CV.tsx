import { useCVStore } from "../state/cvStore";
import { formatDate, formatDateRange } from "../utils/formatDate";
import "../styles/Page.css";

/**
 * Props for the live CV preview.
 */
interface CVProps {
  visible: boolean;
}

/**
 * Joins the present (non-empty) parts of a list with a bullet separator.
 *
 * @param parts - Candidate strings, some of which may be empty.
 * @returns The non-empty parts joined by `" • "`.
 */
function joinPresent(parts: string[]): string {
  return parts.filter(Boolean).join(" • ");
}

/**
 * Read-only, print-friendly rendering of the CV document read from the store.
 * Hidden when the preview is toggled off. "Download PDF" defers to the
 * browser's print dialog.
 */
function CV({ visible }: CVProps) {
  const data = useCVStore((state) => state.data);

  if (!visible) return null;

  const { profile } = data;
  const contactLine = joinPresent([
    profile.email,
    profile.phoneNumber,
    profile.city,
    profile.linkedin,
    profile.github,
    profile.portfolio,
  ]);

  return (
    <div className="CVcontainer">
      <button className="download-btn" onClick={() => window.print()}>
        Download PDF
      </button>
      <div className="CV">
        <section className="cv-header">
          <h1>
            {profile.firstName} {profile.lastName}
          </h1>
          {contactLine && <p className="cv-contact">{contactLine}</p>}
        </section>

        <section className="cv-section">
          <h2>Education</h2>
          {data.education.map((entry) => (
            <div className="cv-entry" key={entry.id}>
              <p>
                <strong>
                  {entry.schoolName} - {entry.degreeName} (
                  {formatDateRange(entry.startDate, entry.endDate, false)})
                </strong>
              </p>
              {entry.degreeCity && (
                <p className="cv-subtext">{entry.degreeCity}</p>
              )}
              {entry.extraNotes && (
                <p className="cv-subtext">{entry.extraNotes}</p>
              )}
            </div>
          ))}
        </section>

        <section className="cv-section">
          <h2>Technical Skills</h2>
          {data.skillGroups.map((group) => (
            <div className="cv-entry" key={group.id}>
              <p>
                <strong>{group.groupName}:</strong>{" "}
                {group.groupValues.join(", ")}
              </p>
            </div>
          ))}
        </section>

        <section className="cv-section">
          <h2>Experience</h2>
          {data.experience.map((exp) => (
            <div className="cv-entry" key={exp.id}>
              <p>
                <strong>
                  {exp.jobTitle} @ {exp.companyName} -{" "}
                  {formatDateRange(exp.fromDate, exp.toDate, exp.current)}
                </strong>
              </p>
              <ul>
                {exp.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="cv-section">
          <h2>Projects</h2>
          {data.projects.map((project) => (
            <div className="cv-entry" key={project.id}>
              <p>
                <strong>
                  {project.projectName} • {formatDate(project.date)}{" "}
                  {project.link && (
                    <span>
                      • <a href={project.link}>Preview</a>
                    </span>
                  )}
                </strong>
              </p>
              <ul>
                {project.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="cv-section cv-entry">
          <h2>Soft Skills</h2>
          <p>{data.softSkills.map((s) => s.skill).join(", ")}</p>
        </section>
      </div>
    </div>
  );
}

export default CV;
