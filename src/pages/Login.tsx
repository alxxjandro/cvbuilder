import { Link, Navigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import GoogleButton from "../components/GoogleButton";
import { CVSheet } from "../components/CV";
import { useAuthStore } from "../state/authStore";
import { SAMPLE_CV } from "../model/cv";
import "../styles/Auth.css";

const SHEET_WIDTH = 794;
const SHEET_SCALE = 0.58;

/**
 * Authentication screen: an editorial showcase panel beside the sign-in card.
 * Already signed-in users skip straight to the dashboard.
 */
function Login() {
  const user = useAuthStore((state) => state.user);
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="auth">
      <aside className="auth-aside" aria-hidden="true">
        <span className="auth-aside-logo">Currio</span>
        <div className="auth-aside-copy">
          <div className="mono auth-aside-eyebrow">ATS-friendly CV builder</div>
          <h2 className="auth-aside-title">
            Pick up right where you left off.
          </h2>
          <p className="auth-aside-sub">
            Your CVs are saved to your account and ready on any device.
          </p>
          <div className="mono auth-aside-proof">
            <span>ATS-READY</span>
            <span className="auth-aside-sep">/</span>
            <span>MULTIPLE CVS</span>
            <span className="auth-aside-sep">/</span>
            <span>PDF &amp; DOCX</span>
          </div>
        </div>
        <div className="auth-aside-art">
          <div
            className="auth-sheet"
            style={{ width: SHEET_WIDTH * SHEET_SCALE }}
          >
            <div
              className="auth-sheet-inner"
              style={{ transform: `scale(${SHEET_SCALE})` }}
            >
              <CVSheet data={SAMPLE_CV} />
            </div>
          </div>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-wordmark">Currio</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">
            Sign in to your CVs and pick up where you left off.
          </p>
          <GoogleButton full />
          <p className="mono auth-legal">
            By continuing you agree to the Terms and Privacy Policy.
          </p>
          <Link to="/" className="auth-back">
            <FiArrowLeft aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Login;
