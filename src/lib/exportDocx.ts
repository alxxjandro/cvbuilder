import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { CVData } from "../types/cv";
import { formatDate, formatDateRange } from "../utils/formatDate";
import { contactLines } from "../components/templates/shared";

/**
 * Builds an ATS-safe `.docx` from a CV document. The output is always
 * single-column, text-only and uses standard section headings regardless of
 * the visual template, so it parses cleanly in applicant tracking systems.
 * The photo and any designed styling are intentionally omitted.
 *
 * @param data - The CV document to convert.
 * @returns A Word document ready to package into a Blob.
 */
function buildDocument(data: CVData): Document {
  const { profile } = data;
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [
        new TextRun(`${profile.firstName} ${profile.lastName}`.trim()),
      ],
    }),
  );
  if (profile.headline) {
    children.push(new Paragraph({ children: [new TextRun(profile.headline)] }));
  }
  const contact = contactLines(profile);
  if (contact.length > 0) {
    children.push(
      new Paragraph({ children: [new TextRun(contact.join("  |  "))] }),
    );
  }
  if (profile.summary) {
    children.push(
      new Paragraph({
        spacing: { before: 120 },
        children: [new TextRun(profile.summary)],
      }),
    );
  }

  const heading = (text: string): Paragraph =>
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 60 },
      children: [new TextRun(text.toUpperCase())],
    });

  const bullet = (text: string): Paragraph =>
    new Paragraph({ bullet: { level: 0 }, children: [new TextRun(text)] });

  const headed = (title: string, meta: string): Paragraph =>
    new Paragraph({
      spacing: { before: 120 },
      children: [
        new TextRun({ text: title, bold: true }),
        ...(meta ? [new TextRun({ text: `   ${meta}`, italics: true })] : []),
      ],
    });

  if (data.experience.length > 0) {
    children.push(heading("Experience"));
    for (const exp of data.experience) {
      children.push(
        headed(
          [exp.jobTitle, exp.companyName].filter(Boolean).join(" — "),
          [
            formatDateRange(exp.fromDate, exp.toDate, exp.current),
            exp.location,
          ]
            .filter(Boolean)
            .join(" · "),
        ),
      );
      exp.bullets.filter(Boolean).forEach((b) => children.push(bullet(b)));
    }
  }

  if (data.education.length > 0) {
    children.push(heading("Education"));
    for (const edu of data.education) {
      children.push(
        headed(
          [edu.degreeName, edu.schoolName].filter(Boolean).join(" — "),
          [formatDateRange(edu.startDate, edu.endDate, false), edu.degreeCity]
            .filter(Boolean)
            .join(" · "),
        ),
      );
      if (edu.extraNotes) {
        children.push(new Paragraph({ children: [new TextRun(edu.extraNotes)] }));
      }
    }
  }

  if (data.skillGroups.length > 0) {
    children.push(heading("Technical Skills"));
    for (const group of data.skillGroups) {
      children.push(
        new Paragraph({
          spacing: { before: 40 },
          children: [
            new TextRun({ text: `${group.groupName}: `, bold: true }),
            new TextRun(group.groupValues.join(", ")),
          ],
        }),
      );
    }
  }

  if (data.projects.length > 0) {
    children.push(heading("Projects"));
    for (const project of data.projects) {
      children.push(
        headed(
          [project.projectName, project.link].filter(Boolean).join(" — "),
          formatDate(project.date),
        ),
      );
      project.bullets.filter(Boolean).forEach((b) => children.push(bullet(b)));
    }
  }

  const soft = data.softSkills.map((s) => s.skill).filter(Boolean);
  if (soft.length > 0) {
    children.push(heading("Soft Skills"));
    children.push(new Paragraph({ children: [new TextRun(soft.join(", "))] }));
  }

  return new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22 } },
      },
    },
    sections: [{ properties: {}, children }],
  });
}

/**
 * Converts a CV title into a safe `.docx` filename.
 *
 * @param title - The CV title.
 * @returns A filesystem-friendly filename ending in `.docx`.
 */
function fileNameFor(title: string): string {
  const base = title.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  return `${base || "cv"}.docx`;
}

/**
 * Generates an ATS-safe `.docx` for the document and returns it as a Blob.
 *
 * @param data - The CV document.
 * @returns The packaged Word document.
 */
export function buildDocx(data: CVData): Promise<Blob> {
  return Packer.toBlob(buildDocument(data));
}

/**
 * Builds and downloads the document as a `.docx` file in the browser.
 *
 * @param data - The CV document.
 * @param title - The CV title, used for the download filename.
 */
export async function downloadDocx(data: CVData, title: string): Promise<void> {
  const blob = await buildDocx(data);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileNameFor(title);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
