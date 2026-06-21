import { useState } from "react";
import CV from "./CV";
import Sidebar from "./Sidebar";
import "../styles/App.css";

/**
 * Root component. Owns the preview-visibility toggle and composes the editor
 * sidebar with the live preview. The CV document itself lives in the Zustand
 * store, so neither child needs it passed down.
 */
function App() {
  const [previewVisible, setPreviewVisible] = useState(true);

  return (
    <div className={`appRoot ${previewVisible ? "previewMode" : "hiddenMode"}`}>
      <Sidebar
        previewVisible={previewVisible}
        onTogglePreview={() => setPreviewVisible((visible) => !visible)}
      />
      <CV visible={previewVisible} />
    </div>
  );
}

export default App;
