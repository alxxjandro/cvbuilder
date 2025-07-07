import { useState } from "react";

function TechSkills({ setData, data }) {
  const handleGroupNameChange = (e, groupId) => {
    const value = e.target.value;
    setData((prev) => ({
      ...prev,
      techSkills: prev.techSkills.map((group) =>
        group.id === groupId ? { ...group, groupName: value } : group,
      ),
    }));
  };

  function handleGroupDelete(groudId) {
    setData((prev) => ({
      ...prev,
      techSkills: prev.techSkills.filter((group) => group.id !== groudId),
    }));
  }

  // Delete a skill from a group
  function handleDeleteSkill(groupId, skillIndex) {
    setData((prev) => ({
      ...prev,
      techSkills: prev.techSkills.map((group) =>
        group.id === groupId
          ? {
              ...group,
              groupValues: group.groupValues.filter(
                (_, idx) => idx !== skillIndex,
              ),
            }
          : group,
      ),
    }));
  }

  // Add a new skill to a group
  function handleAddSkill(groupId, newSkill) {
    if (!newSkill) return;
    setData((prev) => ({
      ...prev,
      techSkills: prev.techSkills.map((group) =>
        group.id === groupId
          ? { ...group, groupValues: [...group.groupValues, newSkill] }
          : group,
      ),
    }));
  }

  // Add a new skill group
  function handleAddGroup() {
    setData((prev) => ({
      ...prev,
      techSkills: [
        ...prev.techSkills,
        {
          id: Date.now() + Math.random(),
          groupName: "",
          groupValues: [],
        },
      ],
    }));
  }

  return (
    <div className="form-section">
      <button
        type="button"
        onClick={handleAddGroup}
        style={{ marginBottom: "1em" }}
      >
        Add Skill Group
      </button>
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

          {/* Add Skill Input */}
          <AddSkillInput onAdd={(skill) => handleAddSkill(entry.id, skill)} />

          <button type="button" onClick={(e) => handleGroupDelete(entry.id)}>
            Delete group
          </button>
        </section>
      ))}
    </div>
  );
}

// Add this helper component at the bottom of the file, before export
function AddSkillInput({ onAdd }) {
  const [input, setInput] = useState("");
  return (
    <div style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
      <input
        type="text"
        value={input}
        placeholder="Add new skill"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) {
            onAdd(input.trim());
            setInput("");
          }
        }}
      />
      <button
        type="button"
        onClick={() => {
          if (input.trim()) {
            onAdd(input.trim());
            setInput("");
          }
        }}
      >
        Add
      </button>
    </div>
  );
}

export default TechSkills;
