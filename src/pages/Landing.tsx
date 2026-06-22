import { Link } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { CVSheet } from "../components/CV";
import { useAuthStore } from "../state/authStore";
import { SAMPLE_CV } from "../model/cv";
import "../styles/Landing.css";

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
 * Marketing landing page. Open to everyone: logged-out visitors see the
 * sign-in CTA, while signed-in visitors can still browse the public pages and
 * jump back to their dashboard from the hero. The showcase CV is a static
 * example that lives apart from the user's own library.
 */
function Landing() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="landing">
      <SiteHeader />

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="mono landing-eyebrow">ATS-friendly CV builder</div>
          <h1 className="landing-title">Build a CV that actually gets read.</h1>
          <p className="landing-sub">
            Clean, single-column, recruiter-tested templates that sail through
            applicant tracking systems. Free, and yours.
          </p>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary landing-hero-cta">
              Go to your dashboard
            </Link>
          ) : (
            <GoogleButton />
          )}
          <div className="mono landing-proof">
            <span>ATS-READY</span>
            <span className="landing-proof-sep">/</span>
            <span>MULTIPLE CVS</span>
            <span className="landing-proof-sep">/</span>
            <span>PDF &amp; DOCX</span>
          </div>
        </div>
        <div className="landing-hero-visual" aria-hidden="true">
          <div className="landing-hero-frame">
            <div className="landing-hero-frame-inner">
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

      <SiteFooter />
    </div>
  );
}

export default Landing;
