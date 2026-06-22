import type { TemplateId } from "../../types/cv";
import type { TemplateMeta } from "./types";
import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import PortraitTemplate from "./PortraitTemplate";

/**
 * Every selectable template, keyed by id. The picker iterates this map and the
 * editor/dashboard render the `component` for a document's `templateId`.
 */
export const TEMPLATES: Record<TemplateId, TemplateMeta> = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "Single-column editorial layout. Clean and recruiter-proof.",
    atsSafe: true,
    hasPhoto: false,
    component: ClassicTemplate,
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Bolder masthead with accent rules. Still ATS-safe.",
    atsSafe: true,
    hasPhoto: false,
    component: ModernTemplate,
  },
  portrait: {
    id: "portrait",
    name: "Portrait",
    description: "Designed layout with a headshot. For human readers.",
    atsSafe: false,
    hasPhoto: true,
    component: PortraitTemplate,
  },
};

/**
 * Templates in display order for the picker.
 */
export const TEMPLATE_LIST: TemplateMeta[] = [
  TEMPLATES.classic,
  TEMPLATES.modern,
  TEMPLATES.portrait,
];

/**
 * Looks up a template by id, falling back to Classic for an unknown id.
 *
 * @param id - The template id to resolve.
 * @returns The matching {@link TemplateMeta}, or Classic when unrecognized.
 */
export function getTemplate(id: TemplateId): TemplateMeta {
  return TEMPLATES[id] ?? TEMPLATES.classic;
}
