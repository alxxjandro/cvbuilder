import { use, useEffect, useState } from "react";

function Sidebar() {
  const sections = [
    "profile",
    "education",
    "skills",
    "experience",
    "projects",
    "softskills",
  ];
  const [section, setSection] = useState(sections[0]);

  return (
    <div>
      {sections.map((s, index) => 
        <button key={index} onClick={() => setSection(s)}>
          {s}
        </button>
      )}
      {section ? section : "no content"}
    </div>
  );
}

export default Sidebar;
