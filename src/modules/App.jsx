import { useState } from "react";
import CV from "./CV";
import Sidebar from "./Sidebar.JSX";
import "../styles/App.css";

function App() {
  return (
    <>
      <Sidebar />
      <CV />
    </>
  );
}

export default App;
