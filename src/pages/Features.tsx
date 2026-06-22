import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import GoogleButton from "../components/GoogleButton";
import TemplateSheet from "../components/templates/TemplateSheet";
import { TEMPLATE_LIST } from "../components/templates/registry";
import { SAMPLE_CV } from "../model/cv";
import "../styles/Features.css";

const SHEET_WIDTH = 794;

/** A real CV render, scaled, used as editorial material inside the bento. */
function MiniSheet({
  templateId,
  scale,
  className,
}: {
  templateId: (typeof TEMPLATE_LIST)[number]["id"];
  scale: number;
  className?: string;
}) {
  return (
    <div
      className={`ft-mini${className ? ` ${className}` : ""}`}
      style={{ width: SHEET_WIDTH * scale, height: 1123 * scale }}
      aria-hidden="true"
    >
      <div className="ft-mini-inner" style={{ transform: `scale(${scale})` }}>
        <TemplateSheet data={{ ...SAMPLE_CV, templateId }} />
      </div>
    </div>
  );
}

/**
 * Features page, laid out as an editorial bento. The flagship cell shows a
 * real CV; the "versions" cell fans the three real templates. Every cell earns
 * its place — copy and product, no filler icons.
 */
function Features() {
  return (
    <div className="ft">
      <SiteHeader />

      <section className="ft-hero">
        <div className="mono ft-eyebrow">Features</div>
        <h1 className="ft-title">The boring parts, handled. The CV, sharp.</h1>
        <p className="ft-sub">
          Currio takes care of formatting, parsing and exports so you can spend
          your time on what you actually did.
        </p>
      </section>

      <section className="ft-bento">
        <article className="ft-cell ft-a">
          <div className="ft-a-copy">
            <h2 className="ft-cell-title">Read clean by every parser.</h2>
            <p className="ft-cell-body">
              Single column, real text, standard headings. No tables or graphics
              to trip an ATS — nothing between you and the shortlist.
            </p>
          </div>
          <div className="ft-a-art" aria-hidden="true">
            <MiniSheet
              templateId="classic"
              scale={0.42}
              className="ft-a-sheet"
            />
          </div>
        </article>

        <article className="ft-cell ft-b">
          <div className="ft-b-art" aria-hidden="true">
            <MiniSheet
              templateId="classic"
              scale={0.16}
              className="ft-fan ft-fan-1"
            />
            <MiniSheet
              templateId="modern"
              scale={0.16}
              className="ft-fan ft-fan-2"
            />
            <MiniSheet
              templateId="portrait"
              scale={0.16}
              className="ft-fan ft-fan-3"
            />
          </div>
          <div className="ft-cell-foot">
            <h2 className="ft-cell-title">One base, every version.</h2>
            <p className="ft-cell-body">
              Duplicate and retune for each role in a click — keep them side by
              side.
            </p>
          </div>
        </article>

        <article className="ft-cell ft-c">
          <div className="ft-formats" aria-hidden="true">
            <span className="ft-format">PDF</span>
            <span className="ft-format is-ghost">DOCX</span>
          </div>
          <div className="ft-cell-foot">
            <h2 className="ft-cell-title">Yours to export.</h2>
            <p className="ft-cell-body">
              A pixel-clean PDF to send, an editable DOCX when they ask.
            </p>
          </div>
        </article>

        <article className="ft-cell ft-d">
          <h2 className="ft-cell-title">Edits land instantly.</h2>
          <p className="ft-cell-body">
            Type on one side; watch the page set itself on the other.
          </p>
        </article>

        <article className="ft-cell ft-e">
          <h2 className="ft-cell-title">Always where you left it.</h2>
          <p className="ft-cell-body">
            Saved to your account and ready on any device.
          </p>
        </article>

        <article className="ft-cell ft-f">
          <h2 className="ft-f-title">Make yours.</h2>
          <p className="ft-f-sub">Free, and yours to keep.</p>
          <div className="ft-f-btn">
            <GoogleButton />
          </div>
        </article>
      </section>

      <SiteFooter />
    </div>
  );
}

export default Features;
