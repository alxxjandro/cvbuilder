import { GoPlusCircle } from "react-icons/go";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

function TechSkills({ setData, data }) {
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const toggleGroup = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

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
    const newGroup = {
      id: Date.now() + Math.random(),
      groupName: "",
      groupValues: [],
    };
    setData((prev) => ({
      ...prev,
      techSkills: [...prev.techSkills, newGroup],
    }));
    // Auto-expand the new group
    setExpandedGroups((prev) => new Set([...prev, newGroup.id]));
  }

  return (
    <div className="form-section">
      {data.techSkills.map((entry, groupIndex) => (
        <div key={entry.id} className="tech-skill-group">
          <div className="group-header" onClick={() => toggleGroup(entry.id)}>
            <h3>{entry.groupName || "Untitled Skill Group"}</h3>
            <button type="button" className="toggle-btn">
              {expandedGroups.has(entry.id) ? "−" : "+"}
            </button>
          </div>
          
          {expandedGroups.has(entry.id) && (
            <div className="group-content">
              <label htmlFor={`skillSetName-${entry.id}`}>Skill Group Name</label>
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
                      <FaTrash/>
                    </button>
                  </li>
                ))}
              </ul>

              <AddSkillInput onAdd={(skill) => handleAddSkill(entry.id, skill)} />

              <button
                type="button"
                onClick={(e) => handleGroupDelete(entry.id)}
              >
                Delete group
              </button>
            </div>
          )}
        </div>
      ))}
      
      <button type="button" onClick={handleAddGroup} className="buttonInfo">
        <GoPlusCircle /> Add Skill Group
      </button>
    </div>
  );
}

// Add this helper component at the bottom of the file, before export
function AddSkillInput({ onAdd }) {
  const [input, setInput] = useState("");
  return (
    <div>
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
