import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../components/App";

describe("App", () => {
  it("mounts and renders the seeded CV preview", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Hey Stranger" }),
    ).toBeInTheDocument();
  });

  it("renders all section navigation buttons", () => {
    render(<App />);
    for (const name of [
      "Profile",
      "Education",
      "Technical Skills",
      "Experience",
      "Projects",
      "Soft Skills",
    ]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });
});
