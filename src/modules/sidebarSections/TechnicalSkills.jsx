import { useState } from "react";

function TechSkills({ setData, data }) {

  const handleGroupNameChange = (e, groupId) => {
    const value = e.target.value;
      setData(prev => ({
        ...prev,
        techSkills: prev.techSkills.map(group =>
          group.id === groupId ? { ...group, groupName: value } : group
        )
      }));
  };

  function handleGroupDelete(groudId){
    setData(prev => ({
      ...prev,
      techSkills: prev.techSkills.filter(group => group.id !== groudId )
    }))
  }

  // function handleDeleteSkill(sId, sIndex){
  //   setData(prev => )
  // }


  return (
    <div className="form-section">
      {data.techSkills.map((entry, groupIndex) => (
        <section key={entry.id} className="tech-skill-group">
          <label htmlFor={`skillSetName-${entry.id}`}>Skill Group</label>
          <input
            id={`skillSetName-${entry.id}`}
            value={entry.groupName}
            onChange={(e) => handleGroupNameChange(e, entry.id)}
            type="text"
          />

          <ul>
            {entry.groupValues.map((skill, skillIndex) => (
              <li key={skillIndex}>
                {skill}
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(entry.id, skillIndex)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={(e) => handleGroupDelete(entry.id)}
          >
            Delete group
          </button>
        </section>
      ))}
    </div>
  );
};
export default TechSkills;
