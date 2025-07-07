import { useState } from "react";

function Softskills({ setData, data }) {
  function handleSkillChange(index, value) {
    setData((prev) => ({
      ...prev,
      softSkills: prev.softSkills.map((s, i) =>
        i === index ? { skill: value } : s,
      ),
    }));
  }

  function handleDeleteSkill(index) {
    setData((prev) => ({
      ...prev,
      softSkills: prev.softSkills.filter((_, i) => i !== index),
    }));
  }

  function handleAddSkill(value) {
    if (!value) return;
    setData((prev) => ({
      ...prev,
      softSkills: [...prev.softSkills, { skill: value }],
    }));
  }

  return (
    <div className="form-section">
      <ul>
        {data.softSkills.map((s, i) => (
          <li key={i}>
            <input
              type="text"
              value={s.skill}
              onChange={(e) => handleSkillChange(i, e.target.value)}
            />
            <button type="button" onClick={() => handleDeleteSkill(i)}>
              X
            </button>
          </li>
        ))}
      </ul>
      <AddSkillInput onAdd={handleAddSkill} />
    </div>
  );
}

function AddSkillInput({ onAdd }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <input
        type="text"
        value={input}
        placeholder="Add soft skill"
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

export default Softskills;
