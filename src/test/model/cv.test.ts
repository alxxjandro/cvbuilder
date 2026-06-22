import { describe, it, expect } from "vitest";
import type { CVData } from "../../types/cv";
import {
  createEmptyCV,
  createEntry,
  SAMPLE_CV,
  withDefaults,
} from "../../model/cv";

describe("createEmptyCV", () => {
  it("starts with empty profile fields", () => {
    const cv = createEmptyCV();
    expect(cv.profile.firstName).toBe("");
    expect(cv.profile.headline).toBe("");
    expect(cv.profile.summary).toBe("");
    expect(cv.profile.email).toBe("");
    expect(cv.profile.portfolio).toBe("");
  });

  it("starts with empty list sections", () => {
    const cv = createEmptyCV();
    expect(cv.education).toEqual([]);
    expect(cv.skillGroups).toEqual([]);
    expect(cv.experience).toEqual([]);
    expect(cv.projects).toEqual([]);
    expect(cv.softSkills).toEqual([]);
  });

  it("produces independent objects on each call", () => {
    const a = createEmptyCV();
    const b = createEmptyCV();
    a.profile.firstName = "Mutated";
    expect(b.profile.firstName).toBe("");
  });
});

describe("createEmptyCV templateId", () => {
  it("defaults a fresh document to the classic template", () => {
    expect(createEmptyCV().templateId).toBe("classic");
  });
});

describe("withDefaults", () => {
  it("backfills a missing templateId on legacy rows", () => {
    const legacy = { ...createEmptyCV() } as Partial<CVData>;
    delete legacy.templateId;
    expect(withDefaults(legacy as CVData).templateId).toBe("classic");
  });

  it("keeps an explicit templateId", () => {
    const doc: CVData = { ...createEmptyCV(), templateId: "portrait" };
    expect(withDefaults(doc).templateId).toBe("portrait");
  });
});

describe("createEntry", () => {
  it("assigns a unique id to every entry", () => {
    const a = createEntry("education");
    const b = createEntry("education");
    expect(a.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
  });

  it("defaults an experience entry to not current with empty bullets", () => {
    const exp = createEntry("experience");
    expect(exp.current).toBe(false);
    expect(exp.location).toBe("");
    expect(exp.bullets).toEqual([]);
  });

  it("defaults a skill group with an empty values array", () => {
    const group = createEntry("skillGroups");
    expect(group.groupValues).toEqual([]);
  });
});

describe("SAMPLE_CV", () => {
  it("fills every list section with at least one entry", () => {
    expect(SAMPLE_CV.education.length).toBeGreaterThan(0);
    expect(SAMPLE_CV.experience.length).toBeGreaterThan(0);
    expect(SAMPLE_CV.projects.length).toBeGreaterThan(0);
  });

  it("gives every list entry a stable id", () => {
    const sections = [
      SAMPLE_CV.education,
      SAMPLE_CV.skillGroups,
      SAMPLE_CV.experience,
      SAMPLE_CV.projects,
      SAMPLE_CV.softSkills,
    ];
    for (const entries of sections) {
      for (const entry of entries) {
        expect(entry.id).toBeTruthy();
      }
    }
  });
});
