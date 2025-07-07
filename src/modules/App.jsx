import { useState } from "react";
import CV from "./CV";
import Sidebar from "./Sidebar.JSX";
import "../styles/App.css";

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
        schoolName: "Random School",
        degreeName: "A pretty cool degree",
        degreeCity: "Italy",
        startDate: new Date().toISOString().split("T")[0],
        extraNotes: "I had a pretty good time!",
        endDate: new Date().toISOString().split("T")[0],
        id: 1,
      },
    ],
    techSkills: [
      {
        groupName: "Programing Languages",
        groupValues: ["Javascript", "C++", "Python", "MySQL"],
        id: 1,
      },
      {
        groupName: "Operating Systems",
        groupValues: ["Linux", "MacOS", "Windows"],
        id: 2,
      },
      {
        groupName: "Other Software",
        groupValues: [
          "Figma",
          "Adobe Suite",
          "Microsoft Suite",
          "Davinci Resolve",
        ],
        id: 3,
      },
    ],
    experience: [
      {
        jobTitle: "Front-end Developer Intern",
        companyName: "Spotify",
        fromDate: new Date().toISOString().split("T")[0],
        toDate: new Date().toISOString().split("T")[0],
        jobDescription: [
          "Proposed and develope new UI's for the platform",
          "Lead a team of 4 people during 3 months",
        ],
      },
      {
        jobTitle: "Full-stack Junior Developer",
        companyName: "Google",
        fromDate: new Date().toISOString().split("T")[0],
        toDate: "Present",
        jobDescription: [
          "Handle complex query's and optimized the search engine",
          "Updated youtube's UI for mobile devices",
        ],
      },
    ],
    projects: [
      {
        projectName: "Personal Portfolio",
        description: [
          "Built with React and Vite",
          "Deployed on Vercel with custom domain",
          "Features dynamic theming and responsive design",
        ],
        link: "https://alxxjandro.com/portfolio",
        date: new Date().toISOString().split("T")[0],
      },
      {
        projectName: "Weather App",
        description: [
          "Fetched real-time weather data using OpenWeatherMap API",
          "Used useEffect and useContext for state and API management",
          "Clean mobile-first UI built with Tailwind CSS",
        ],
        link: "https://github.com/alxxjandro/weather-app",
        date: new Date().toISOString().split("T")[0],
      },
    ],
    softSkills: [
      { skill: "Teamwork" },
      { skill: "Communication" },
      { skill: "Problem-solving" },
      { skill: "Time management" },
      { skill: "Adaptability" },
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
