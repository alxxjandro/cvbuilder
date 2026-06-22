import { describe, it, expect } from "vitest";
import {
  TEMPLATES,
  TEMPLATE_LIST,
  getTemplate,
} from "../../../components/templates/registry";

describe("template registry", () => {
  it("exposes every template keyed by its own id", () => {
    for (const [id, meta] of Object.entries(TEMPLATES)) {
      expect(meta.id).toBe(id);
      expect(meta.name).toBeTruthy();
      expect(typeof meta.component).toBe("function");
    }
  });

  it("marks the photo-bearing template as not ATS-safe", () => {
    expect(TEMPLATES.portrait.hasPhoto).toBe(true);
    expect(TEMPLATES.portrait.atsSafe).toBe(false);
    expect(TEMPLATES.classic.atsSafe).toBe(true);
    expect(TEMPLATES.modern.atsSafe).toBe(true);
  });

  it("lists every template once", () => {
    expect(TEMPLATE_LIST).toHaveLength(Object.keys(TEMPLATES).length);
  });

  it("falls back to classic for an unknown id", () => {
    // @ts-expect-error exercising the runtime fallback with a bad id
    expect(getTemplate("nope").id).toBe("classic");
  });
});
