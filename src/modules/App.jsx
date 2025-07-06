import { useState } from "react";
import CV from "./CV";
import Sidebar from "./Sidebar.JSX";
import "../styles/App.css";
import Education from "./sidebarSections/Education";

function App() {
  const [view, setView] = useState(true);
  const [cvData, setCvData] = useState({
    profile: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      city: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    education: [],
  });

  return (
    <div className={`appRoot ${view ? "previewMode" : "hiddenMode"}`}>
      <Sidebar
        data={cvData}
        setData={setCvData}
        view={view}
        setView={setView}
      />
      <CV data={cvData} view={view} />
    </div>
  );
}

export default App;
