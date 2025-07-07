import "../styles/Page.css";

function formatDate(dateStr) {
  if (!dateStr) return [false, ""];
  try {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return [false, ""];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    return [true, `${year} ${month}`];
  } catch {
    return [false, ""];
  }
}

function CV({ data, view }) {
  if (!view) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="CVcontainer">
      <button className="download-btn" onClick={handlePrint}>
        Download PDF
      </button>
      <div className="CV">

        
        {/* Header */}
        <section className="cv-header">
          <h1>
            {data.profile.firstName} {data.profile.lastName}
          </h1>
          <p className="cv-contact">
            {data.profile.email} • {data.profile.phoneNumber} •{" "}
            {data.profile.linkedin} • {data.profile.github}
          </p>
        </section>

        {/* Education */}
        <section className="cv-section">
          <h2>Education</h2>
          {data.education.map((e) => {
            const [, start] = formatDate(e.startDate);
            const [, end] = formatDate(e.endDate);
            return (
              <div className="cv-entry" key={e.id}>
                <p>
                  <strong>
                    {e.schoolName} - {e.degreeName} ({start} - {end})
                  </strong>
                </p>
                <p className="cv-subtext">{e.degreeCity}</p>
                {e.extraNotes && <p className="cv-subtext">{e.extraNotes}</p>}
              </div>
            );
          })}
        </section>

        {/* Technical Skills */}
        <section className="cv-section">
          <h2>Technical Skills</h2>
          {data.techSkills.map((group, i) => (
            <div className="cv-entry" key={i}>
              <p>
                <strong>{group.groupName}:</strong>{" "}
                {group.groupValues.join(", ")}
              </p>
            </div>
          ))}
        </section>

        {/* Experience */}
        <section className="cv-section">
          <h2>Experience</h2>
          {data.experience.map((exp, i) => {
            const [, from] = formatDate(exp.fromDate);
            const [validTo, to] = formatDate(exp.toDate);
            return (
              <div className="cv-entry" key={i}>
                <p>
                  <strong>
                    {exp.jobTitle} @ {exp.companyName} - {from}
                    {validTo ? ` to ${to}` : " – Present"}
                  </strong>
                </p>
                {exp.jobLink && <p className="cv-subtext">{exp.jobLink}</p>}
                <ul>
                  {exp.jobDescription.map((desc, j) => (
                    <li key={j}>{desc}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        {/* Projects */}
        <section className="cv-section">
          <h2>Projects</h2>
          {data.projects.map((proj, i) => {
            const [, projDate] = formatDate(proj.date);
            return (
              <div className="cv-entry" key={i}>
                <p>
                  <strong>
                    {proj.projectName} • {projDate}{" "}
                    {proj.link && (
                      <span>
                        • <a href={proj.link}>Preview</a>
                      </span>
                    )}
                  </strong>
                </p>
                <ul>
                  {proj.description.map((desc, j) => (
                    <li key={j}>{desc}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        {/* Soft Skills */}
        <section className="cv-section cv-entry">
          <h2>Soft Skills</h2>
          <p>{data.softSkills.map((s) => s.skill).join(", ")}</p>
        </section>
      </div>
    </div>
  );
}

export default CV;
