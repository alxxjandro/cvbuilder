import { describe, it, expect } from "vitest";
import { buildDocx } from "../../lib/exportDocx";
import { SAMPLE_CV, createEmptyCV } from "../../model/cv";

describe("buildDocx", () => {
  it("produces a non-empty Word document for a full CV", async () => {
    const blob = await buildDocx(SAMPLE_CV);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("handles an empty document without throwing", async () => {
    const blob = await buildDocx(createEmptyCV());
    expect(blob.size).toBeGreaterThan(0);
  });
});
