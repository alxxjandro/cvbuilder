import { useState } from "react";

function Projects({ setData, data }) {
  function handleFieldChange(index, field, value) {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  }

  function handleDeleteProject(index) {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  }

  function handleAddProject() {
    setData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          projectName: "",
          description: [],
          link: "",
          date: "",
        }
      ]
    }));
  }

  function handleDescChange(projIndex, descIndex, value) {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === projIndex
          ? {
              ...proj,
              description: proj.description.map((desc, j) =>
                j === descIndex ? value : desc
              )
            }
          : proj
      )
    }));
  }

  function handleDeleteDesc(projIndex, descIndex) {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === projIndex
          ? {
              ...proj,
              description: proj.description.filter((_, j) => j !== descIndex)
            }
          : proj
      )
    }));
  }

  function handleAddDesc(projIndex, value) {
    if (!value) return;
    setData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === projIndex
          ? { ...proj, description: [...proj.description, value] }
          : proj
      )
    }));
  }

  return (
    <div className="form-section">
      <button type="button" onClick={handleAddProject}>
        Add Project
      </button>
      {data.projects.map((proj, i) => (
        <section key={i} className="project-entry">
          <label>Project Name
            <input
              type="text"
              value={proj.projectName}
              onChange={e => handleFieldChange(i, 'projectName', e.target.value)}
            />
          </label>
          <label>Link
            <input
              type="text"
              value={proj.link}
              onChange={e => handleFieldChange(i, 'link', e.target.value)}
            />
          </label>
          <label>Date
            <input
              type="date"
              value={proj.date}
              onChange={e => handleFieldChange(i, 'date', e.target.value)}
            />
          </label>
          <div>
            <strong>Description</strong>
            <ul>
              {proj.description.map((desc, j) => (
                <li key={j}>
                  <input
                    type="text"
                    value={desc}
                    onChange={e => handleDescChange(i, j, e.target.value)}
                  />
                  <button type="button" onClick={() => handleDeleteDesc(i, j)}>X</button>
                </li>
              ))}
            </ul>
            <AddDescInput onAdd={val => handleAddDesc(i, val)} />
          </div>
          <button type="button" onClick={() => handleDeleteProject(i)}>
            Delete Project
          </button>
        </section>
      ))}
    </div>
  );
}

function AddDescInput({ onAdd }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <input
        type="text"
        value={input}
        placeholder="Add description bullet"
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
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

export default Projects;
