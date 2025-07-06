import "../styles/App.css"

function CV({ data, view }) {
  if (!view) return null;

  return (
    <div className="CVcontainer">
      <div className="CV">
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

        {/* <section className="cv-section techskills-section">
          <h2>Technical Skills</h2>
          <ul>
            {data.techSkills.map((skill, index) => (
              <li key={index}>{skill.skillName}</li>
            ))}
          </ul>
        </section> */}

      </div>
    </div>
  );
}

export default CV;
