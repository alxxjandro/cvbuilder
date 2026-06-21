import { useState } from "react";
import type { ComponentType } from "react";
import Profile from "./sections/Profile";
import Education from "./sections/Education";
import TechnicalSkills from "./sections/TechnicalSkills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import SoftSkills from "./sections/SoftSkills";
import { FaEye, FaEyeSlash, FaFolder } from "react-icons/fa";
import { IoPerson, IoSchool } from "react-icons/io5";
import { FaCode } from "react-icons/fa6";
import { MdWork } from "react-icons/md";
import { HiChatAlt2 } from "react-icons/hi";
import type { IconType } from "react-icons";
import "../styles/Sidebar.css";

/**
 * A single navigable editor section. Each section component reads the CV
 * document from the store, so none require props.
 */
interface Section {
  name: string;
  component: ComponentType;
  icon: IconType;
}

const SECTIONS: Section[] = [
  { name: "Profile", component: Profile, icon: IoPerson },
  { name: "Education", component: Education, icon: IoSchool },
  { name: "Technical Skills", component: TechnicalSkills, icon: FaCode },
  { name: "Experience", component: Experience, icon: MdWork },
  { name: "Projects", component: Projects, icon: FaFolder },
  { name: "Soft Skills", component: SoftSkills, icon: HiChatAlt2 },
];

/**
 * Props for the editor sidebar.
 */
interface SidebarProps {
  previewVisible: boolean;
  onTogglePreview: () => void;
}

/**
 * Left-hand editor: navigates between CV sections and toggles the live
 * preview.
 */
function Sidebar({ previewVisible, onTogglePreview }: SidebarProps) {
  const [active, setActive] = useState<Section>(SECTIONS[0]);
  const ActiveSection = active.component;

  return (
    <div className="sidebar">
      <div className="sidebarButtons">
        {SECTIONS.map((section) => (
          <button
            key={section.name}
            onClick={() => setActive(section)}
            className={active.name === section.name ? "active" : ""}
          >
            <div className="buttonInfo">
              {section.name}
              <section.icon />
            </div>
          </button>
        ))}
        <button onClick={onTogglePreview}>
          {previewVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className="section">
        <ActiveSection />
      </div>
    </div>
  );
}

export default Sidebar;
