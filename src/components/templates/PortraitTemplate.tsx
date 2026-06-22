import type { CVData } from "../../types/cv";
import { formatDate, formatDateRange } from "../../utils/formatDate";
import { contactLines, initials } from "./shared";

/**
 * Portrait template: a designed layout with an accent header band and a
 * headshot. NOT ATS-optimized (it carries a photo and a coloured masthead),
 * so it is meant for human readers and direct sharing rather than for parsers.
 *
 * @param data - The document to render.
 */
export default function PortraitTemplate({ data }: { data: CVData }) {
  const { profile } = data;
  const contact = contactLines(profile);
  const monogram = initials(profile.firstName, profile.lastName);

  return (
    <article className="cv-print-sheet tpl-portrait">
      <header className="por-masthead">
        <div className="por-photo">
          {profile.photo ? (
            <img src={profile.photo} alt="" className="por-photo-img" />
          ) : (
            <span className="por-photo-monogram">{monogram}</span>
          )}
        </div>
        <div className="por-identity">
          <h1 className="por-name">
            {profile.firstName} {profile.lastName}
          </h1>
          {profile.headline && (
            <p className="por-headline">{profile.headline}</p>
          )}
          {contact.length > 0 && (
            <div className="por-contact">
              {contact.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="por-body">
        {profile.summary && <p className="por-summary">{profile.summary}</p>}

        {data.experience.length > 0 && (
          <section className="por-section">
            <h2 className="por-section-title">Experience</h2>
            {data.experience.map((exp) => (
              <div className="por-entry" key={exp.id}>
                <div className="por-entry-head">
                  <div className="por-entry-title">{exp.jobTitle}</div>
                  <div className="por-entry-meta">
                    {formatDateRange(exp.fromDate, exp.toDate, exp.current)}
                  </div>
                </div>
                <div className="por-entry-org">
                  {exp.companyName}
                  {exp.location && <span> · {exp.location}</span>}
                </div>
                <ul className="por-bullets">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {data.education.length > 0 && (
          <section className="por-section">
            <h2 className="por-section-title">Education</h2>
            {data.education.map((entry) => (
              <div className="por-entry" key={entry.id}>
                <div className="por-entry-head">
                  <div className="por-entry-title">{entry.degreeName}</div>
                  <div className="por-entry-meta">
                    {formatDateRange(entry.startDate, entry.endDate, false)}
                  </div>
                </div>
                <div className="por-entry-org">
                  {entry.schoolName}
                  {entry.degreeCity && <span> · {entry.degreeCity}</span>}
                </div>
                {entry.extraNotes && (
                  <p className="por-entry-note">{entry.extraNotes}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {data.skillGroups.length > 0 && (
          <section className="por-section">
            <h2 className="por-section-title">Technical Skills</h2>
            {data.skillGroups.map((group) => (
              <div className="por-skill" key={group.id}>
                <span className="por-skill-label">{group.groupName}</span>
                <span className="por-skill-value">
                  {group.groupValues.join(", ")}
                </span>
              </div>
            ))}
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="por-section">
            <h2 className="por-section-title">Projects</h2>
            {data.projects.map((project) => (
              <div className="por-entry" key={project.id}>
                <div className="por-entry-head">
                  <div className="por-entry-title">
                    {project.projectName}
                    {project.link && (
                      <a className="por-link" href={project.link}>
                        {project.link}
                      </a>
                    )}
                  </div>
                  <div className="por-entry-meta">
                    {formatDate(project.date)}
                  </div>
                </div>
                <ul className="por-bullets">
                  {project.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {data.softSkills.length > 0 && (
          <section className="por-section">
            <h2 className="por-section-title">Soft Skills</h2>
            <p className="por-soft">
              {data.softSkills
                .map((s) => s.skill)
                .filter(Boolean)
                .join(" · ")}
            </p>
          </section>
        )}
      </div>
    </article>
  );
}
