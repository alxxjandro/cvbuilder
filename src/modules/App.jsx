import { useState } from "react";
import CV from "./CV";
import Sidebar from "./Sidebar.JSX";
import "../styles/App.css";
import Education from "./sidebarSections/Education";

function App() {
  const [cvData, setCvData] = useState({
    profile: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      city: "",
      linkedIn: "",
      gitHub: "",
      portfolio: "",
    },
    education: {},
  });

  return (
    <>
      <Sidebar data={cvData} setData={setCvData} />
      <CV data={cvData} />
    </>
  );
}

export default App;
