import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { FaTrash } from "react-icons/fa";

function Education({ setData, data, addEducationEntry }) {
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const startNewForm = () => {
    const newEntry = {
      schoolName: "",
      degreeName: "",
      degreeCity: "",
      startDate: "",
      endDate: "",
      extraNotes: "",
      id: Date.now(),
    };
    setFormData(newEntry);
    setEditingId(newEntry.id);
    setData((prev) => ({ ...prev, education: [...prev.education, newEntry] }));
  };

  const startEdit = (entry) => {
    setFormData(entry);
    setEditingId(entry.id);
  };

  const cancelEdit = () => {
    const isNew = !data.education.find((e) => e.id === editingId);
    if (isNew) {
      setData((prev) => ({
        ...prev,
        education: prev.education.filter((e) => e.id !== editingId),
      }));
    }
    setEditingId(null);
    setFormData({});
  };

  const submitForm = () => {
    addEducationEntry(formData, true);
    setEditingId(null);
    setFormData({});
  };

  const deleteEntry = (id) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
    if (editingId === id) {
      setEditingId(null);
      setFormData({});
    }
  };

  return (
    <div className="education">
      {data.education.map((entry) => (
        <div className="education-entry" key={entry.id}>
          {!editingId && <h3>{entry.schoolName || "(No School Name)"}</h3>}
          {editingId !== entry.id && (
            <button id="editEducation" onClick={() => startEdit(entry)}>
              Edit
            </button>
          )}

          {editingId === entry.id && (
            <div className="Schoolform">
              <label>School</label>
              <input
                id="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
              />
              <label>Degree</label>
              <input
                id="degreeName"
                value={formData.degreeName}
                onChange={handleChange}
              />
              <label>City</label>
              <input
                id="degreeCity"
                value={formData.degreeCity}
                onChange={handleChange}
              />
              <label>Start Date</label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
              <label>End Date</label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
              <label>Description</label>
              <input
                id="extraNotes"
                value={formData.extraNotes}
                onChange={handleChange}
              />

              <div className="formButtons">
                <div className="deleteBtn">
                  <button onClick={() => deleteEntry(entry.id)}>
                    <FaTrash />
                  </button>
                </div>
                <div className="otherBtns">
                  <button onClick={cancelEdit}>Cancel</button>
                  <button onClick={submitForm}>Submit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button className="buttonInfo" onClick={startNewForm}>
        <GoPlusCircle /> Add Education
      </button>
    </div>
  );
}

export default Education;
