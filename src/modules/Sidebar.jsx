import { useEffect, useState } from "react";
import Profile from "./sidebarSections/Profile";
import Education from "./sidebarSections/Education";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Sidebar({ data, setData, view, setView }) {

  const sections = [
    { name: "Profile", component: Profile },
    { name: "Education", component: Education },
  ];
  const [section, setSection] = useState(sections[0]);
  const SectionComponent = section.component;

  const toggleView = () => {
    return setView(!view);
  };

  return (
    <div className="sidebar">

      {sections.map((s, index) => (
        <button key={index} onClick={() => setSection(s)}>
          {s.name}
        </button>
      ))}

      <button onClick={toggleView}>
        {view ? <FaEyeSlash /> : <FaEye />}{" "}
      </button>

      <div className="section">
        {SectionComponent ? (
          <SectionComponent data={data} setData={setData} />
        ) : (
          "no content"
        )}
      </div>
    </div>
  );
}

export default Sidebar;
