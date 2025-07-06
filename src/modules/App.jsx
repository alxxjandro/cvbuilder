import { useState } from "react";
import CV from "./CV";
import Sidebar from "./Sidebar.JSX";
import "../styles/App.css";
import Education from "./sidebarSections/Education";

function App() {
  const [view, setView] = useState(true);

  //load up de page with some dummy data
  const [cvData, setCvData] = useState({
    profile: {
      firstName: "Alonso",
      lastName: "Alarcón",
      email: "alejandro33p@icloud.com",
      phoneNumber: "123-456-7890",
      city: "Madrid, Spain",
      linkedin: "Alonso Alarcon",
      github: "alxxjandro",
      portfolio: "alxxjandro.com",
    },
    education: [
      {
        "schoolName": "Random School",
        "degreeName": "A pretty cool degree",
        "degreeCity": "Italy",
        "startDate": new Date().toISOString().split('T')[0],
        "extraNotes": "I had a pretty good time!",
        "endDate": new Date().toISOString().split('T')[0],
        "id": 1,
      },
    ],
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
