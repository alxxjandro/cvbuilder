import "../styles/App.css";

function CV({ data, view }) {
  if (!view) return null;

  return (
    <div className="CVcontainer">
      <div className="CV">
        {/* Profile */}
        <section className="cv-section profile-section">
          <h2>Profile</h2>
          <p><strong>Name:</strong> {data.profile.firstName} {data.profile.lastName}</p>
          <p><strong>Email:</strong> {data.profile.email}</p>
          <p><strong>Phone:</strong> {data.profile.phoneNumber}</p>
          <p><strong>City:</strong> {data.profile.city}</p>
          <p><strong>LinkedIn:</strong> {data.profile.linkedin}</p>
          <p><strong>GitHub:</strong> {data.profile.github}</p>
          <p><strong>Portfolio:</strong> {data.profile.portfolio}</p>
        </section>

        {/* Education */}
        <section className="cv-section education-section">
          <h2>Education</h2>
          {data.education.map((e) => (
            <div className="education-entry" key={e.id}>
              <p><strong>School:</strong> {e.schoolName}</p>
              <p><strong>Degree:</strong> {e.degreeName}</p>
              <p><strong>City:</strong> {e.degreeCity}</p>
              <p><strong>Start:</strong> {e.startDate}</p>
              <p><strong>End:</strong> {e.endDate}</p>
              <p><strong>Notes:</strong> {e.extraNotes}</p>
            </div>
          ))}
        </section>

        {/* Technical Skills */}
        <section className="cv-section techskills-section">
          <h2>Technical Skills</h2>
          {data.techSkills.map((group, index) => (
            <div key={index}>
              <p><strong>{group.groupName}</strong></p>
              <ul>
                {group.groupValues.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Experience */}
        <section className="cv-section experience-section">
          <h2>Experience</h2>
          {data.experience.map((exp, index) => (
            <div className="experience-entry" key={index}>
              <p><strong>{exp.jobTitle}</strong> @ {exp.companyName}</p>
              <p>{exp.fromDate} - {exp.toDate}</p>
              <ul>
                {exp.jobDescription.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="cv-section projects-section">
          <h2>Projects</h2>
          {data.projects.map((proj, index) => (
            <div className="project-entry" key={index}>
              <p><strong>{proj.projectName}</strong></p>
              <p><strong>Date:</strong> {proj.date}</p>
              <ul>
                {proj.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
              <p><strong>Link:</strong> <a href={proj.link} target="_blank" rel="noreferrer">{proj.link}</a></p>
            </div>
          ))}
        </section>

        {/* Soft Skills */}
        <section className="cv-section softskills-section">
          <h2>Soft Skills</h2>
          <ul>
            {data.softSkills.map((skill, index) => (
              <li key={index}>{skill.skill}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default CV;