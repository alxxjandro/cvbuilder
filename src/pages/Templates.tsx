import { useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiUser } from "react-icons/fi";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import TemplateSheet from "../components/templates/TemplateSheet";
import { TEMPLATE_LIST } from "../components/templates/registry";
import { SAMPLE_CV } from "../model/cv";
import "../styles/TemplatesPage.css";

const SHEET_WIDTH = 794;
const SHEET_HEIGHT = 1123;
const SHOWCASE_SCALE = 0.58;

/**
 * Templates page. The real templates are the centerpiece: pick one and the
 * actual template component renders Maya's CV at full size beside a panel that
 * explains who each layout is for. Everything shown here is a live render of
 * the same component the editor uses — no mockups.
 */
function Templates() {
  const [active, setActive] = useState(0);
  const template = TEMPLATE_LIST[active];
  const data = { ...SAMPLE_CV, templateId: template.id };

  return (
    <div className="tplp">
      <SiteHeader />

      <section className="tplp-hero">
        <div className="mono tplp-eyebrow">Templates</div>
        <h1 className="tplp-title">Three layouts. One honest CV.</h1>
        <p className="tplp-sub">
          Every template renders the very same content you write — pick the one
          that fits the room you're walking into.
        </p>
      </section>

      <section className="tplp-showcase">
        <div className="tplp-rail" role="tablist" aria-label="Templates">
          {TEMPLATE_LIST.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`tplp-tab${i === active ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="tplp-tab-name">{t.name}</span>
              <span className="tplp-tab-desc">{t.description}</span>
            </button>
          ))}
        </div>

        <div className="tplp-stage">
          <div className="tplp-frame">
            <div
              className="tplp-sheet"
              style={{
                width: SHEET_WIDTH * SHOWCASE_SCALE,
                height: SHEET_HEIGHT * SHOWCASE_SCALE,
              }}
            >
              <div
                className="tplp-sheet-inner"
                key={template.id}
                style={{ transform: `scale(${SHOWCASE_SCALE})` }}
              >
                <TemplateSheet data={data} />
              </div>
            </div>
          </div>

          <aside className="tplp-info" key={`${template.id}-info`}>
            <span className="mono tplp-info-kicker">Now viewing</span>
            <h2 className="tplp-info-name">{template.name}</h2>
            <p className="tplp-info-desc">{template.description}</p>

            <div className="tplp-badges">
              <span
                className={`tplp-badge${template.atsSafe ? " is-good" : ""}`}
              >
                <FiCheck aria-hidden="true" />
                {template.atsSafe ? "ATS-safe" : "Best for human readers"}
              </span>
              {template.hasPhoto && (
                <span className="tplp-badge">
                  <FiUser aria-hidden="true" /> Includes a photo
                </span>
              )}
            </div>

            <Link to="/login" className="btn btn-dark tplp-info-cta">
              Start with {template.name}
            </Link>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default Templates;
