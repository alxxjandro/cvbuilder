import { memo, useEffect, useRef } from "react";
import { FiCheck } from "react-icons/fi";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import GoogleButton from "../components/GoogleButton";
import TemplateSheet from "../components/templates/TemplateSheet";
import { usePinnedProgress } from "../hooks/useScrollProgress";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { SAMPLE_CV, SAMPLE_FRONTEND, SAMPLE_FULLSTACK } from "../model/cv";
import "../styles/HowItWorks.css";

const SHEET_WIDTH = 794;
const SHEET_HEIGHT = 1123;

/** Big, protagonist-sized CV for the immersive desktop coverflow. */
const SCALE = 0.54;
const SHEET_W = SHEET_WIDTH * SCALE;
const SHEET_H = SHEET_HEIGHT * SCALE;
const SPACING_X = 300; // horizontal gap between coverflow cards

/** Smaller, readable CV for the mobile swipe carousel. */
const M_SCALE = 0.4;
const M_W = SHEET_WIDTH * M_SCALE;
const M_H = SHEET_HEIGHT * M_SCALE;

/** The four narrative beats, shown as the floating caption. */
const STEPS = [
  {
    title: "Sign in with Google",
    body: "One click, no password. Your CVs are tied to your account and ready on any device.",
  },
  {
    title: "Start from a clean template",
    body: "A recruiter-tested, single-column layout you just fill in — profile, experience, skills.",
  },
  {
    title: "Tailor for each role",
    body: "Spin up tailored cuts — backend, frontend, full-stack — without ever losing your base CV.",
  },
  {
    title: "Export and apply",
    body: "Download a pixel-clean PDF or an editable DOCX. What you see is exactly what ships.",
  },
];

/**
 * The three real variants the stage rotates between — the same person tailored
 * to a different role, each shown in a different real template so the rotation
 * truly transforms.
 */
const VARIANTS = [
  {
    data: { ...SAMPLE_CV, templateId: "classic" as const },
    label: "Backend · Classic",
  },
  {
    data: { ...SAMPLE_FRONTEND, templateId: "modern" as const },
    label: "Frontend · Modern",
  },
  {
    data: { ...SAMPLE_FULLSTACK, templateId: "portrait" as const },
    label: "Full-stack · Portrait",
  },
];

const STEP_STARTS = [0, 0.22, 0.45, 0.75];

/**
 * Memoized template render. The coverflow re-renders on every scroll frame to
 * update transforms; memoizing keeps the (static) CV DOM from reconciling each
 * time, so scrolling stays smooth.
 */
const MemoTemplateSheet = memo(TemplateSheet);

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

/**
 * The immersive desktop experience: a large CV that stays center-stage and
 * rotates through the tailored variants in a coverflow as the page scrolls,
 * with the narrative riding along as a floating caption.
 */
function ImmersiveStage() {
  const scrollyRef = useRef<HTMLDivElement>(null);
  const { progress: p, mode } = usePinnedProgress(scrollyRef);

  useEffect(() => {
    const m = window.location.hash.match(/p=([\d.]+)/);
    if (!m) return;
    const frac = parseFloat(m[1]);
    const id = setTimeout(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, max * frac);
    }, 400);
    return () => clearTimeout(id);
  }, []);

  // One scroll value drives everything. The deck rotates across the middle
  // 84% of the scroll so there's a calm intro and outro.
  const activeFloat = clamp01((p - 0.08) / 0.84) * (VARIANTS.length - 1);
  const activeStep = Math.max(0, STEP_STARTS.filter((s) => p >= s).length - 1);
  const exported = clamp01((p - 0.86) / 0.1);
  const step = STEPS[activeStep];

  return (
    <div className="hiw-scrolly" ref={scrollyRef}>
      <div className={`hiw-stage is-${mode}`}>
        <div className="hiw-deck" aria-hidden="true">
          {VARIANTS.map((variant, i) => {
            const offset = i - activeFloat;
            const dist = Math.abs(offset);
            const tx = offset * SPACING_X;
            const tz = -dist * 220;
            const ry = clamp(offset, -1.4, 1.4) * -34;
            const scale = 1 - Math.min(dist, 2) * 0.13;
            const opacity = clamp01(1 - Math.min(dist, 1.8) * 0.4);
            const isLast = i === VARIANTS.length - 1;

            return (
              <div
                className="hiw-sheet"
                key={variant.label}
                style={{
                  width: SHEET_W,
                  height: SHEET_H,
                  zIndex: 100 - Math.round(dist * 10),
                  opacity,
                  transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
                }}
              >
                <div
                  className="hiw-sheet-inner"
                  style={{ transform: `scale(${SCALE})` }}
                >
                  <MemoTemplateSheet data={variant.data} />
                </div>
                <span className="mono hiw-sheet-tag">{variant.label}</span>
                {isLast && (
                  <span
                    className="hiw-stamp"
                    style={{
                      opacity: exported,
                      transform: `rotate(-8deg) scale(${0.8 + exported * 0.2})`,
                    }}
                  >
                    <FiCheck aria-hidden="true" /> Exported
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="hiw-caption" key={activeStep}>
          <span className="mono hiw-caption-kicker">
            Step {activeStep + 1} — of 4
          </span>
          <h2 className="hiw-caption-title">{step.title}</h2>
          <p className="hiw-caption-body">{step.body}</p>
          <div className="hiw-dots" aria-hidden="true">
            {STEPS.map((s, i) => (
              <span
                className={`hiw-dot${i === activeStep ? " is-active" : ""}`}
                key={s.title}
              />
            ))}
          </div>
        </div>

        <div
          className="mono hiw-scrollhint"
          style={{ opacity: clamp01(1 - p * 10) }}
          aria-hidden="true"
        >
          Scroll to build it
        </div>
      </div>
    </div>
  );
}

/**
 * The small-screen fallback: a swipeable carousel of the real CV variants with
 * the steps listed below — no 3D, but the CV still leads.
 */
function StackedStage() {
  return (
    <div className="hiw-stacked">
      <div className="hiw-carousel">
        {VARIANTS.map((variant) => (
          <div className="hiw-carousel-item" key={variant.label}>
            <div
              className="hiw-sheet hiw-sheet--static"
              style={{ width: M_W, height: M_H }}
            >
              <div
                className="hiw-sheet-inner"
                style={{ transform: `scale(${M_SCALE})` }}
              >
                <TemplateSheet data={variant.data} />
              </div>
            </div>
            <span className="mono hiw-carousel-tag">{variant.label}</span>
          </div>
        ))}
      </div>
      <ol className="hiw-list">
        {STEPS.map((step, i) => (
          <li className="hiw-list-item" key={step.title}>
            <span className="mono hiw-list-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="hiw-list-title">{step.title}</h2>
              <p className="hiw-list-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * "How it works": a scroll-driven story where a full-size CV is the lead
 * actor — it rotates through Maya's backend, frontend and full-stack cuts as
 * you scroll, then gets stamped "Exported". Degrades to a swipe carousel on
 * small screens.
 */
function HowItWorks() {
  const isMobile = useMediaQuery("(max-width: 900px)");

  return (
    <div className="hiw">
      <SiteHeader />

      <section className="hiw-hero">
        <div className="mono hiw-eyebrow">How it works</div>
        <h1 className="hiw-title">One CV. Every version of you.</h1>
        <p className="hiw-sub">
          Scroll and watch a single document turn into a tailored CV for every
          role — the same story you'll tell with your own.
        </p>
      </section>

      {isMobile ? <StackedStage /> : <ImmersiveStage />}

      <section className="hiw-outro">
        <div className="mono hiw-outro-eyebrow">Your turn</div>
        <h2 className="hiw-outro-title">Build yours the same way.</h2>
        <p className="hiw-outro-sub">
          Start from a clean template and have a polished CV ready to send today
          — free, and yours.
        </p>
        <div className="hiw-outro-btn">
          <GoogleButton />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default HowItWorks;
