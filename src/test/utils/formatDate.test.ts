import { describe, it, expect } from "vitest";
import { formatDate, formatDateRange } from "../../utils/formatDate";

describe("formatDate", () => {
  it("returns an empty string for empty input", () => {
    expect(formatDate("")).toBe("");
  });

  it("returns an empty string for an invalid date", () => {
    expect(formatDate("not-a-date")).toBe("");
  });

  it("formats an ISO date as 'YYYY Mon'", () => {
    expect(formatDate("2024-06-15")).toBe("2024 Jun");
  });

  it("parses ISO dates without timezone drift (Jan 1 stays in January)", () => {
    expect(formatDate("2024-01-01")).toBe("2024 Jan");
  });

  it("rejects an out-of-range month", () => {
    expect(formatDate("2024-13-01")).toBe("");
  });
});

describe("formatDateRange", () => {
  it("joins start and end with an en dash", () => {
    expect(formatDateRange("2022-01-01", "2024-06-01", false)).toBe(
      "2022 Jan – 2024 Jun",
    );
  });

  it("renders 'Present' when the entry is current", () => {
    expect(formatDateRange("2022-01-01", "", true)).toBe("2022 Jan – Present");
  });

  it("returns just the start when there is no end", () => {
    expect(formatDateRange("2022-01-01", "", false)).toBe("2022 Jan");
  });

  it("returns an empty string when there are no dates", () => {
    expect(formatDateRange("", "", false)).toBe("");
  });
});
