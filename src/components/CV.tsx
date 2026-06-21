import { useCVStore } from "../state/cvStore";
import type { CVData } from "../types/cv";
import { formatDate, formatDateRange } from "../utils/formatDate";
import "../styles/Page.css";

/**
 * Props for the live CV preview.
 */
interface CVProps {
  visible: boolean;
}

/**
 * Props for the CV sheet. When `data` is omitted the sheet reads the live
 * working document from the store; pass `data` to render an arbitrary CV (for
 * dashboard thumbnails and the landing showcase).
 */
interface CVSheetProps {
  data?: CVData;
}

/**
 * Joins the present (non-empty) parts of a list with a middot separator.
 *
 * @param parts - Candidate strings, some of which may be empty.
 * @returns The non-empty parts joined by `" · "`, or `""` when all are empty.
 */
function joinPresent(parts: string[]): string {
  return parts.filter(Boolean).join(" · ");
}

/**
 * The CV paper sheet itself, laid out as the editorial "Currio" document and
 * read directly from the store. Rendered standalone in the editor preview and
 * the landing hero, and wrapped by {@link CV} for the print-friendly stage.
 */
export function CVSheet({ data: dataProp }: CVSheetProps = {}) {
  const storeData = useCVStore((state) => state.data);
  const data = dataProp ?? storeData;

  const { profile } = data;
  const contactLines = [
    profile.email,
    joinPresent([profile.phoneNumber, profile.city]),
    joinPresent([profile.github, profile.linkedin, profile.portfolio]),
  ].filter(Boolean);

  return (
    <article className="cv-sheet">
      <header className="cv-masthead">
        <div className="cv-identity">
          <h1 className="cv-name">
            {profile.firstName} {profile.lastName}
          </h1>
          {profile.headline && (
            <p className="cv-headline">{profile.headline}</p>
          )}
        </div>
        {contactLines.length > 0 && (
          <div className="cv-contact">
            {contactLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </header>

      {profile.summary && <p className="cv-summary">{profile.summary}</p>}

      <section className="cv-section">
        <h2 className="cv-section-title">Experience</h2>
        {data.experience.map((exp) => (
          <div className="cv-entry" key={exp.id}>
            <div className="cv-entry-head">
              <div>
                <div className="cv-entry-title">{exp.jobTitle}</div>
                <div className="cv-entry-org">{exp.companyName}</div>
              </div>
              <div className="cv-entry-meta">
                <div>
                  {formatDateRange(exp.fromDate, exp.toDate, exp.current)}
                </div>
                {exp.location && <div>{exp.location}</div>}
              </div>
            </div>
            <ul className="cv-bullets">
              {exp.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="cv-section">
        <h2 className="cv-section-title">Education</h2>
        {data.education.map((entry) => (
          <div className="cv-entry cv-entry--tight" key={entry.id}>
            <div className="cv-entry-head">
              <div>
                <div className="cv-entry-title">{entry.degreeName}</div>
                <div className="cv-entry-org">{entry.schoolName}</div>
              </div>
              <div className="cv-entry-meta">
                <div>
                  {formatDateRange(entry.startDate, entry.endDate, false)}
                </div>
                {entry.degreeCity && <div>{entry.degreeCity}</div>}
              </div>
            </div>
            {entry.extraNotes && (
              <p className="cv-entry-note">{entry.extraNotes}</p>
            )}
          </div>
        ))}
      </section>

      <section className="cv-section">
        <h2 className="cv-section-title">Technical Skills</h2>
        {data.skillGroups.map((group) => (
          <div className="cv-skill" key={group.id}>
            <span className="cv-skill-label">{group.groupName}</span>
            <span className="cv-skill-sep">:</span>
            <span className="cv-skill-value">
              {group.groupValues.join(", ")}
            </span>
          </div>
        ))}
      </section>

      <section className="cv-section">
        <h2 className="cv-section-title">Projects</h2>
        {data.projects.map((project) => (
          <div className="cv-entry cv-entry--tight" key={project.id}>
            <div className="cv-entry-head">
              <div className="cv-project-title">
                {project.projectName}
                {project.link && (
                  <a className="cv-project-link" href={project.link}>
                    {project.link}
                  </a>
                )}
              </div>
              <div className="cv-entry-meta">{formatDate(project.date)}</div>
            </div>
            <ul className="cv-bullets">
              {project.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="cv-section">
        <h2 className="cv-section-title">Soft Skills</h2>
        <p className="cv-soft">
          {joinPresent(data.softSkills.map((s) => s.skill))}
        </p>
      </section>
    </article>
  );
}

/**
 * Print-friendly preview stage: centers the {@link CVSheet} on the warm paper
 * background with a download action. Hidden when the preview is toggled off;
 * "Download PDF" defers to the browser's print dialog.
 */
function CV({ visible }: CVProps) {
  if (!visible) return null;

  return (
    <div className="cv-stage">
      <button className="cv-download" onClick={() => window.print()}>
        Download PDF
      </button>
      <CVSheet />
    </div>
  );
}

export default CV;
