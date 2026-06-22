import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Features from "../pages/Features";
import HowItWorks from "../pages/HowItWorks";
import Templates from "../pages/Templates";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Editor from "../pages/Editor";
import RequireAuth from "./RequireAuth";

/**
 * Route table for the app. Exported on its own so tests can mount it inside a
 * memory router.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/cv/:id"
        element={
          <RequireAuth>
            <Editor />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * Application root. Wires the browser router around the route table.
 */
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
