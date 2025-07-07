import { useState } from "react";

function Experience({ setData, data }) {
  // Helper to update a field in an experience entry
  function handleFieldChange(index, field, value) {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      ),
    }));
  }

  // Delete an experience entry
  function handleDeleteExperience(index) {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  }

  // Add a new experience entry
  function handleAddExperience() {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          jobTitle: "",
          companyName: "",
          fromDate: "",
          toDate: "",
          jobDescription: [],
        },
      ],
    }));
  }

  // Update a job description bullet point
  function handleJobDescChange(expIndex, descIndex, value) {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              jobDescription: exp.jobDescription.map((desc, j) =>
                j === descIndex ? value : desc,
              ),
            }
          : exp,
      ),
    }));
  }

  // Delete a job description bullet point
  function handleDeleteJobDesc(expIndex, descIndex) {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              jobDescription: exp.jobDescription.filter(
                (_, j) => j !== descIndex,
              ),
            }
          : exp,
      ),
    }));
  }

  // Add a new job description bullet point
  function handleAddJobDesc(expIndex, value) {
    if (!value) return;
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex
          ? { ...exp, jobDescription: [...exp.jobDescription, value] }
          : exp,
      ),
    }));
  }

  return (
    <div className="form-section">
      <button type="button" onClick={handleAddExperience}>
        Add Experience
      </button>
      {data.experience.map((exp, i) => (
        <section key={i} className="experience-entry">
          <label>
            Job Title
            <input
              type="text"
              value={exp.jobTitle}
              onChange={(e) => handleFieldChange(i, "jobTitle", e.target.value)}
            />
          </label>
          <label>
            Company Name
            <input
              type="text"
              value={exp.companyName}
              onChange={(e) =>
                handleFieldChange(i, "companyName", e.target.value)
              }
            />
          </label>
          <label>
            From
            <input
              type="date"
              value={exp.fromDate}
              onChange={(e) => handleFieldChange(i, "fromDate", e.target.value)}
            />
          </label>
          <label>
            To
            <input
              type="text"
              value={exp.toDate}
              onChange={(e) => handleFieldChange(i, "toDate", e.target.value)}
              placeholder="To date or 'Present'"
            />
          </label>
          <div>
            <strong>Job Description</strong>
            <ul>
              {exp.jobDescription.map((desc, j) => (
                <li key={j}>
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => handleJobDescChange(i, j, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteJobDesc(i, j)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
            <AddJobDescInput onAdd={(val) => handleAddJobDesc(i, val)} />
          </div>
          <button type="button" onClick={() => handleDeleteExperience(i)}>
            Delete Experience
          </button>
        </section>
      ))}
    </div>
  );
}

function AddJobDescInput({ onAdd }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <input
        type="text"
        value={input}
        placeholder="Add job description bullet"
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

export default Experience;
