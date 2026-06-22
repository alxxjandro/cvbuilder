import type { CVData } from "../../types/cv";
import { formatDate, formatDateRange } from "../../utils/formatDate";
import { contactLines } from "./shared";

/**
 * Modern template: a single-column layout with a bolder masthead, an accent
 * rule on each section and roomier typography. Still ATS-safe (real text,
 * standard headings, one column, no images).
 *
 * @param data - The document to render.
 */
export default function ModernTemplate({ data }: { data: CVData }) {
  const { profile } = data;
  const contact = contactLines(profile);

  return (
    <article className="cv-print-sheet tpl-modern">
      <header className="mod-masthead">
        <h1 className="mod-name">
          {profile.firstName} {profile.lastName}
        </h1>
        {profile.headline && <p className="mod-headline">{profile.headline}</p>}
        {contact.length > 0 && (
          <div className="mod-contact">{contact.join("  ·  ")}</div>
        )}
      </header>

      {profile.summary && <p className="mod-summary">{profile.summary}</p>}

      {data.experience.length > 0 && (
        <section className="mod-section">
          <h2 className="mod-section-title">Experience</h2>
          {data.experience.map((exp) => (
            <div className="mod-entry" key={exp.id}>
              <div className="mod-entry-head">
                <div className="mod-entry-title">{exp.jobTitle}</div>
                <div className="mod-entry-meta">
                  {formatDateRange(exp.fromDate, exp.toDate, exp.current)}
                </div>
              </div>
              <div className="mod-entry-org">
                {exp.companyName}
                {exp.location && <span> · {exp.location}</span>}
              </div>
              <ul className="mod-bullets">
                {exp.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mod-section">
          <h2 className="mod-section-title">Education</h2>
          {data.education.map((entry) => (
            <div className="mod-entry" key={entry.id}>
              <div className="mod-entry-head">
                <div className="mod-entry-title">{entry.degreeName}</div>
                <div className="mod-entry-meta">
                  {formatDateRange(entry.startDate, entry.endDate, false)}
                </div>
              </div>
              <div className="mod-entry-org">
                {entry.schoolName}
                {entry.degreeCity && <span> · {entry.degreeCity}</span>}
              </div>
              {entry.extraNotes && (
                <p className="mod-entry-note">{entry.extraNotes}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {data.skillGroups.length > 0 && (
        <section className="mod-section">
          <h2 className="mod-section-title">Technical Skills</h2>
          {data.skillGroups.map((group) => (
            <div className="mod-skill" key={group.id}>
              <span className="mod-skill-label">{group.groupName}</span>
              <span className="mod-skill-value">
                {group.groupValues.join(", ")}
              </span>
            </div>
          ))}
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mod-section">
          <h2 className="mod-section-title">Projects</h2>
          {data.projects.map((project) => (
            <div className="mod-entry" key={project.id}>
              <div className="mod-entry-head">
                <div className="mod-entry-title">
                  {project.projectName}
                  {project.link && (
                    <a className="mod-link" href={project.link}>
                      {project.link}
                    </a>
                  )}
                </div>
                <div className="mod-entry-meta">{formatDate(project.date)}</div>
              </div>
              <ul className="mod-bullets">
                {project.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.softSkills.length > 0 && (
        <section className="mod-section">
          <h2 className="mod-section-title">Soft Skills</h2>
          <p className="mod-soft">
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
