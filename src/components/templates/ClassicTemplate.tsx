import type { CVData } from "../../types/cv";
import { formatDate, formatDateRange } from "../../utils/formatDate";
import { contactLines } from "./shared";

/**
 * Classic template: the single-column editorial layout. ATS-safe (real text,
 * standard headings, no images or columns). This is a standalone component,
 * deliberately decoupled from the decorative {@link CVSheet} so the two can
 * evolve independently.
 *
 * @param data - The document to render.
 */
export default function ClassicTemplate({ data }: { data: CVData }) {
  const { profile } = data;
  const contact = contactLines(profile);

  return (
    <article className="cv-print-sheet cv-sheet tpl-classic">
      <header className="cv-masthead">
        <div className="cv-identity">
          <h1 className="cv-name">
            {profile.firstName} {profile.lastName}
          </h1>
          {profile.headline && (
            <p className="cv-headline">{profile.headline}</p>
          )}
        </div>
        {contact.length > 0 && (
          <div className="cv-contact">
            {contact.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </header>

      {profile.summary && <p className="cv-summary">{profile.summary}</p>}

      {data.experience.length > 0 && (
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
      )}

      {data.education.length > 0 && (
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
      )}

      {data.skillGroups.length > 0 && (
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
      )}

      {data.projects.length > 0 && (
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
      )}

      {data.softSkills.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Soft Skills</h2>
          <p className="cv-soft">
            {data.softSkills
              .map((s) => s.skill)
              .filter(Boolean)
              .join(" · ")}
          </p>
        </section>
      )}
    </article>
  );
}
