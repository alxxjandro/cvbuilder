import { Link } from "react-router-dom";
import "../styles/Landing.css";

/**
 * Shared footer for the public marketing pages. The product column links to the
 * real section pages; company links are placeholders and the connect column
 * points at the author's profiles.
 */
function SiteFooter() {
  return (
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
            <Link to="/features" className="landing-footer-link">
              Features
            </Link>
            <Link to="/how-it-works" className="landing-footer-link">
              How it works
            </Link>
            <Link to="/templates" className="landing-footer-link">
              Templates
            </Link>
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
  );
}

export default SiteFooter;
