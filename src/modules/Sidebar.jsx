import { useState } from "react";
import Profile from "./sidebarSections/Profile";
import Education from "./sidebarSections/Education";
import TechSkills from "./sidebarSections/TechnicalSkills";
import Experience from "./sidebarSections/Experience";
import Projects from "./sidebarSections/Projects";
import Softskills from "./sidebarSections/Softskills";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoPerson, IoSchool } from "react-icons/io5";
import { FaCode } from "react-icons/fa6";
import { MdWork } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { HiChatAlt2 } from "react-icons/hi";
import "../styles/Sidebar.css";

function Sidebar({ data, setData, view, setView }) {
  const sections = [
    { name: "Profile", component: Profile, icon: IoPerson },
    { name: "Education", component: Education, icon: IoSchool },
    { name: "Technical Skills", component: TechSkills, icon: FaCode },
    { name: "Experience", component: Experience, icon: MdWork },
    { name: "Projects", component: Projects, icon: FaFolder },
    { name: "Soft Skills", component: Softskills, icon: HiChatAlt2 },
  ];
  const [section, setSection] = useState(sections[0]);
  const SectionComponent = section.component;

  const toggleView = () => setView(!view);

  const handleSetter = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [id]: value,
      },
    }));
  };

  const addEducationEntry = (entry, isEdit = false) => {
    setData((prev) => ({
      ...prev,
      education: isEdit
        ? prev.education.map((e) => (e.id === entry.id ? entry : e))
        : [...prev.education, entry],
    }));
  };

  return (
    <div className="sidebar">
      <div className="sidebarButtons">
        {sections.map((s, index) => (
          <button
            key={index}
            onClick={() => setSection(s)}
            className={section.name === s.name ? "active" : ""}
          >
            <div className="buttonInfo">
              {s.name}
              {s.icon && <s.icon />}
            </div>
          </button>
        ))}
        <button onClick={toggleView}>
          {view ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className="section">
        {SectionComponent ? (
          <SectionComponent
            data={data}
            setData={setData}
            handleSetter={handleSetter}
            addEducationEntry={addEducationEntry}
          />
        ) : (
          "An error occurred, please try again"
        )}
      </div>
    </div>
  );
}

export default Sidebar;
