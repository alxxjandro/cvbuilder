import { useEffect, useState } from "react";
import Profile from "./sidebarSections/Profile";
import Education from "./sidebarSections/Education";

function Sidebar() {
  const sections = [
    {name: "profile", content: <Profile/>},
    {name: "education", content: <Education/>}
  ];

  const [section, setSection] = useState(sections[0]);

  return (
    <div className="sidebar">
      {sections.map((s, index) => 
        <button key={index} onClick={() => setSection(s)}>
          {s.name}
        </button>
      )}
      <div className="section">
        {section ? section.content : "no content"}
      </div>
    </div>
  );
}

export default Sidebar;
