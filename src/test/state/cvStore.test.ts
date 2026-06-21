import { describe, it, expect, beforeEach } from "vitest";
import { useCVStore } from "../../state/cvStore";
import { createEmptyCV, SAMPLE_CV } from "../../model/cv";

/**
 * Reads the live store state.
 *
 * @returns The current {@link useCVStore} state.
 */
const store = () => useCVStore.getState();

beforeEach(() => {
  store().load(createEmptyCV());
});

describe("cvStore · profile", () => {
  it("updates a single profile field", () => {
    store().updateProfileField("firstName", "Ada");
    expect(store().data.profile.firstName).toBe("Ada");
  });

  it("does not mutate the previous document", () => {
    const before = store().data;
    store().updateProfileField("email", "a@b.com");
    expect(before.profile.email).toBe("");
  });
});

describe("cvStore · entries", () => {
  it("adds a new entry with a fresh id", () => {
    store().addEntry("education");
    expect(store().data.education).toHaveLength(1);
    expect(store().data.education[0].id).toBeTruthy();
  });

  it("updates only the entry matching the id", () => {
    store().addEntry("experience");
    store().addEntry("experience");
    const targetId = store().data.experience[0].id;

    store().updateEntry("experience", targetId, {
      jobTitle: "Engineer",
      current: true,
    });

    expect(store().data.experience[0].jobTitle).toBe("Engineer");
    expect(store().data.experience[0].current).toBe(true);
    expect(store().data.experience[1].jobTitle).toBe("");
  });

  it("deletes an entry by id", () => {
    store().addEntry("projects");
    const id = store().data.projects[0].id;
    store().deleteEntry("projects", id);
    expect(store().data.projects).toHaveLength(0);
  });
});

describe("cvStore · reorder", () => {
  beforeEach(() => store().load(structuredClone(SAMPLE_CV)));

  it("moves an entry up", () => {
    const second = store().data.experience[1].id;
    store().reorderEntry("experience", second, "up");
    expect(store().data.experience[0].id).toBe(second);
  });

  it("is a no-op when moving the first entry up", () => {
    const order = store().data.experience.map((e) => e.id);
    store().reorderEntry("experience", order[0], "up");
    expect(store().data.experience.map((e) => e.id)).toEqual(order);
  });
});

describe("cvStore · bullets", () => {
  beforeEach(() => store().load(structuredClone(SAMPLE_CV)));

  it("adds a bullet to an experience entry", () => {
    const id = store().data.experience[0].id;
    const before = store().data.experience[0].bullets.length;
    store().addBullet("experience", id, "New achievement");
    expect(store().data.experience[0].bullets).toHaveLength(before + 1);
    expect(store().data.experience[0].bullets.at(-1)).toBe("New achievement");
  });

  it("adds a value to a skill group (groupValues field)", () => {
    const id = store().data.skillGroups[0].id;
    store().addBullet("skillGroups", id, "Rust");
    expect(store().data.skillGroups[0].groupValues.at(-1)).toBe("Rust");
  });

  it("updates a bullet at an index", () => {
    const id = store().data.projects[0].id;
    store().updateBullet("projects", id, 0, "Rewritten");
    expect(store().data.projects[0].bullets[0]).toBe("Rewritten");
  });

  it("deletes a bullet at an index", () => {
    const id = store().data.projects[0].id;
    const before = store().data.projects[0].bullets.length;
    store().deleteBullet("projects", id, 0);
    expect(store().data.projects[0].bullets).toHaveLength(before - 1);
  });
});

describe("cvStore · load", () => {
  it("replaces the whole document", () => {
    store().load(SAMPLE_CV);
    expect(store().data).toBe(SAMPLE_CV);
  });
});
