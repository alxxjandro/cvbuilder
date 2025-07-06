import { useState } from "react";
import Profile from "./sidebarSections/Profile";
import Education from "./sidebarSections/Education";
import TechSkills from "./sidebarSections/TechnicalSkills";
import Experience from "./sidebarSections/Experience";
import Projects from "./sidebarSections/Projects";
import Softskills from "./sidebarSections/Softskills";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Sidebar({ data, setData, view, setView }) {
  const sections = [
    { name: "Profile", component: Profile },
    { name: "Education", component: Education },
    { name: "Technical Skills", component: TechSkills},
    { name: "Experience", component: Experience },
    { name: "Projects", component: Projects},
    { name: "Soft Skills", component: Softskills },
  ];
  const [section, setSection] = useState(sections[0]);
  const SectionComponent = section.component;

  const toggleView = () => {
    return setView(!view);
  };

  //used to update the entrys on profile
  const handleSetter = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData((prev) => ({
      ...prev,
      [section.name]: {
        ...prev[section.name],
        [id]: value,
      },
    }));
  };

  //for adding schools to the state
  const addEducationEntry = (entry, isEdit = false) => {
    setData(prev => ({
      ...prev,
      education: isEdit
        ? prev.education.map(e => e.id === entry.id ? entry : e) 
        : [...prev.education, entry],
    }));
  };

  return (
    <div className="sidebar">
      {sections.map((s, index) => (
        <button key={index} onClick={() => setSection(s)}>
          {s.name}
        </button>
      ))}

      <button onClick={toggleView}>{view ? <FaEyeSlash /> : <FaEye />} </button>

      <div className="section">
        {SectionComponent ? (
          <SectionComponent
            data={data}
            setData={setData}
            handleSetter={handleSetter}
            addEducationEntry={addEducationEntry}
          />
        ) : (
          "An error coured, please try again"
        )}
      </div>
    </div>
  );
}

export default Sidebar;
