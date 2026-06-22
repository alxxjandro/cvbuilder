import { FiFilePlus } from "react-icons/fi";
import type { CVData, TemplateId } from "../types/cv";
import { SAMPLE_CV } from "../model/cv";
import { TEMPLATE_LIST } from "./templates/registry";
import type { TemplateMeta } from "./templates/types";
import TemplateSheet from "./templates/TemplateSheet";
import "../styles/NewCVDialog.css";

const SHEET_WIDTH = 794;
const SHEET_HEIGHT = 1123;
const PREVIEW_SCALE = 0.215;

/**
 * Builds the sample document a template preview renders, reusing the shared
 * sample content under the template being shown.
 *
 * @param id - The template to preview.
 * @returns A sample {@link CVData} tagged with `id`.
 */
function previewData(id: TemplateId): CVData {
  return { ...SAMPLE_CV, templateId: id };
}

/**
 * A scaled, real rendering of a template used as a picker thumbnail.
 */
function TemplatePreview({ id }: { id: TemplateId }) {
  return (
    <div
      className="tpl-preview"
      style={{
        width: SHEET_WIDTH * PREVIEW_SCALE,
        height: SHEET_HEIGHT * PREVIEW_SCALE,
      }}
    >
      <div
        className="tpl-preview-inner"
        style={{ transform: `scale(${PREVIEW_SCALE})` }}
      >
        <TemplateSheet data={previewData(id)} />
      </div>
    </div>
  );
}

/**
 * A single template choice card.
 */
function TemplateCard({
  meta,
  onPick,
}: {
  meta: TemplateMeta;
  onPick: (id: TemplateId) => void;
}) {
  return (
    <button
      type="button"
      className="newcv-card"
      onClick={() => onPick(meta.id)}
    >
      <div className="newcv-card-preview">
        <TemplatePreview id={meta.id} />
      </div>
      <div className="newcv-card-foot">
        <div className="newcv-card-head">
          <span className="newcv-card-name">{meta.name}</span>
          <span
            className={`newcv-badge${meta.atsSafe ? " is-ats" : " is-designed"}`}
          >
            {meta.atsSafe ? "ATS-optimized" : "Designed"}
          </span>
        </div>
        <p className="newcv-card-desc">{meta.description}</p>
      </div>
    </button>
  );
}

/**
 * Modal shown when starting a new CV: a blank document plus the available
 * templates, each with a live preview and an ATS label. Choosing a card
 * creates a CV with that template and opens the editor.
 */
export default function NewCVDialog({
  onPick,
  onClose,
}: {
  onPick: (id: TemplateId) => void;
  onClose: () => void;
}) {
  return (
    <div className="newcv-backdrop" onClick={onClose}>
      <div
        className="newcv-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Start a new CV"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="newcv-header">
          <div>
            <h2 className="newcv-title">Start a new CV</h2>
            <p className="newcv-subtitle">
              Pick a template, or start from a blank document. The Portrait
              template carries a photo and is not optimized for ATS parsers.
            </p>
          </div>
          <button
            type="button"
            className="newcv-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="newcv-grid">
          <button
            type="button"
            className="newcv-card newcv-card--blank"
            onClick={() => onPick("classic")}
          >
            <div className="newcv-blank-icon">
              <FiFilePlus aria-hidden="true" />
            </div>
            <div className="newcv-card-foot">
              <div className="newcv-card-head">
                <span className="newcv-card-name">Blank</span>
              </div>
              <p className="newcv-card-desc">
                A clean single-column document to fill in from scratch.
              </p>
            </div>
          </button>

          {TEMPLATE_LIST.map((meta) => (
            <TemplateCard key={meta.id} meta={meta} onPick={onPick} />
          ))}
        </div>
      </div>
    </div>
  );
}
