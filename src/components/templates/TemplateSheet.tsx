import type { CVData } from "../../types/cv";
import { getTemplate } from "./registry";
import "../../styles/templates.css";

/**
 * Renders a CV document with the template recorded on it. This is the single
 * entry point used by the editor preview, the dashboard thumbnails and the
 * print mount, so every surface stays consistent with the chosen template.
 *
 * @param data - The document to render.
 */
export default function TemplateSheet({ data }: { data: CVData }) {
  const Template = getTemplate(data.templateId).component;
  return <Template data={data} />;
}
