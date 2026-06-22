import { Link, Navigate } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import { CVSheet } from "../components/CV";
import { useAuthStore } from "../state/authStore";
import { SAMPLE_CV } from "../model/cv";
import "../styles/Landing.css";

const SHEET_WIDTH = 794;
const HERO_SCALE = 0.66;

/**
 * A tilted, tailored CV thumbnail in the dark band. Decorative: it uses
 * skeleton lines rather than full content.
 */
interface BandCard {
  role: string;
  badge?: string;
  className: string;
}

const BAND_CARDS: BandCard[] = [
  { role: "Generalist", className: "is-left" },
  { role: "Design · UI", className: "is-mid" },
  { role: "Backend · Go", className: "is-right" },
];

/**
 * Marketing landing page for logged-out visitors. Signed-in users are sent
 * straight to their dashboard. The showcase CV is a static example that lives
 * apart from the user's own library.
 */
function Landing() {
  const user = useAuthStore((state) => state.user);
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="landing">
      <header className="landing-nav">
        <span className="landing-logo">Currio</span>
        <Link to="/login" className="landing-signin">
          Sign in
        </Link>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="mono landing-eyebrow">ATS-friendly CV builder</div>
          <h1 className="landing-title">Build a CV that actually gets read.</h1>
          <p className="landing-sub">
            Clean, single-column, recruiter-tested templates that sail through
            applicant tracking systems. Free, and yours.
          </p>
          <GoogleButton />
          <div className="mono landing-proof">
            <span>ATS-READY</span>
            <span className="landing-proof-sep">/</span>
            <span>MULTIPLE CVS</span>
            <span className="landing-proof-sep">/</span>
            <span>PDF &amp; DOCX</span>
          </div>
        </div>
        <div className="landing-hero-visual" aria-hidden="true">
          <div
            className="landing-hero-frame"
            style={{
              width: SHEET_WIDTH * HERO_SCALE,
              transform: "rotate(3deg)",
            }}
          >
            <div
              className="landing-hero-frame-inner"
              style={{ transform: `scale(${HERO_SCALE})` }}
            >
              <CVSheet data={SAMPLE_CV} />
            </div>
          </div>
        </div>
      </section>

      <section className="landing-band">
        <div className="landing-band-copy">
          <div className="mono landing-band-eyebrow">Made for tailoring</div>
          <h2 className="landing-band-title">
            One base CV. Every version you need.
          </h2>
          <p className="landing-band-body">
            Duplicate any CV in a click and tune it for the role: Backend,
            Design, or Generalist. Keep them all in one place, side by side,
            always true to your story.
          </p>
          <div className="mono landing-band-tags">
            <span>KEEP MANY</span>
            <span className="landing-band-sep">/</span>
            <span>DUPLICATE</span>
            <span className="landing-band-sep">/</span>
            <span>TAILOR</span>
          </div>
        </div>
        <div className="landing-band-cards" aria-hidden="true">
          {BAND_CARDS.map((card) => (
            <div className={`landing-card ${card.className}`} key={card.role}>
              {card.badge && (
                <span className="landing-card-badge">{card.badge}</span>
              )}
              <div className="landing-card-name">Maya Okonkwo</div>
              <div className="mono landing-card-role">{card.role}</div>
              <div className="landing-card-rule" />
              <div className="landing-card-bar is-head" />
              <div className="landing-card-bar is-long" />
              <div className="landing-card-bar is-mid" />
              <div className="landing-card-bar is-head" />
              <div className="landing-card-bar is-long" />
              <div className="landing-card-bar is-head" />
              <div className="landing-card-bar is-long" />
              <div className="landing-card-bar is-mid" />
              <div className="landing-card-bar is-head" />
              <div className="landing-card-bar is-long" />
              <div className="landing-card-bar is-head" />
              <div className="landing-card-bar is-long" />
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-top">
          <div className="landing-footer-brand">
            <span className="landing-footer-logo">Currio</span>
            <p className="landing-footer-tagline">
              The free, ATS-friendly CV builder. Made for people who'd rather be
              applying than formatting.
            </p>
          </div>
          <div className="landing-footer-cols">
            <div className="landing-footer-col">
              <div className="mono landing-footer-heading">Product</div>
              <span className="landing-footer-link">Features</span>
              <span className="landing-footer-link">How it works</span>
              <span className="landing-footer-link">Templates</span>
            </div>
            <div className="landing-footer-col">
              <div className="mono landing-footer-heading">Company</div>
              <span className="landing-footer-link">About</span>
              <span className="landing-footer-link">Privacy</span>
              <span className="landing-footer-link">Terms</span>
            </div>
            <div className="landing-footer-col">
              <div className="mono landing-footer-heading">Connect</div>
              <span className="landing-footer-link">
                <a target="_blank" href="https://github.com/alxxjandro">
                  GitHub
                </a>
              </span>
              <span className="landing-footer-link">
                <a target="_blank" href="https://alxxjandro.com/">
                  Website
                </a>
              </span>
              <span
                className="landing-footer-link"
                onClick={() => {
                  window.location.href =
                    "mailto:alejandro33p@icloud.com?subject=Contact";
                }}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Mail
              </span>
            </div>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <span className="mono">© {new Date().getFullYear()} Currio</span>
          <span className="mono">Build by Alex</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
