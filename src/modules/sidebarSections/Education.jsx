import "../../styles/Profile.css";
import { useEffect, useState } from "react";
import { GoPlusCircle } from "react-icons/go";

function Education({ data, addEducationEntry }) {
  const [form, setForm] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    degreeName: "",
    degreeCity: "",
    startDate: "",
    endDate: "",
    extraNotes: "",
    id: Date.now(),
  });

  const updateFormData = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCancel = () => {
    setForm(false);
    setFormData({
      schoolName: "",
      degreeName: "",
      degreeCity: "",
      startDate: "",
      endDate: "",
      extraNotes: "",
      id: "",
    });
  };

  const handleSubmit = () => {
    addEducationEntry(formData);
    setForm(false);
    setFormData({
      schoolName: "",
      degreeName: "",
      degreeCity: "",
      startDate: "",
      endDate: "",
      extraNotes: "",
      id: "",
    });
  };

  const handleNewForm = () => {
    setFormData({
      schoolName: "",
      degreeName: "",
      degreeCity: "",
      startDate: "",
      endDate: "",
      extraNotes: "",
      id: Date.now(),
    });
    setForm(true);
  };

  return (
    <div className="education">
      <div className="newField">
        <button onClick={handleNewForm}>
          <GoPlusCircle /> Education
        </button>

        {data.education.map((e) => (
          <h1 key={e.id}>{e.schoolName}</h1>
        ))}

        {form && (
          <div className="Schoolform">
            <div className="schoolInfo">
              <label htmlFor="schoolName">School</label>
              <input
                id="schoolName"
                type="text"
                value={formData.schoolName}
                onChange={updateFormData}
              />

              <label htmlFor="degreeName">Degree</label>
              <input
                id="degreeName"
                type="text"
                value={formData.degreeName}
                onChange={updateFormData}
              />

              <label htmlFor="degreeCity">City</label>
              <input
                id="degreeCity"
                type="text"
                value={formData.degreeCity}
                onChange={updateFormData}
              />
            </div>

            <div className="school dates">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={updateFormData}
              />

              <label htmlFor="endDate">Graduation Date</label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={updateFormData}
              />
            </div>

            <div>
              <label htmlFor="extraNotes">Description (optional)</label>
              <input
                id="extraNotes"
                type="text"
                value={formData.extraNotes}
                onChange={updateFormData}
              />
            </div>

            <div className="formButtons">
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Education;
