import type { ComponentType } from "react";
import type { CVData, TemplateId } from "../../types/cv";

/**
 * Describes one selectable CV template: its identity, the human-facing copy
 * shown in the picker, whether it is safe for ATS parsers, whether it renders
 * a photo, and the component that draws it.
 */
export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  /** True when the layout is single-column, text-only and parser-friendly. */
  atsSafe: boolean;
  /** True when the template renders the profile headshot. */
  hasPhoto: boolean;
  component: ComponentType<{ data: CVData }>;
}
