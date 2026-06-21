import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Profile from "../../../components/sections/Profile";
import { useCVStore } from "../../../state/cvStore";
import { createEmptyCV } from "../../../model/cv";

beforeEach(() => {
  useCVStore.getState().load(createEmptyCV());
});

describe("Profile", () => {
  it("edits a profile field through the store", async () => {
    const user = userEvent.setup();
    render(<Profile />);

    const firstName = screen.getByLabelText("First Name");
    await user.type(firstName, "Ada");

    expect(firstName).toHaveValue("Ada");
    expect(useCVStore.getState().data.profile.firstName).toBe("Ada");
  });

  it("renders an input for every social field", () => {
    render(<Profile />);
    expect(screen.getByLabelText("LinkedIn Profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Portfolio")).toBeInTheDocument();
  });

  it("edits the headline and summary through the store", async () => {
    const user = userEvent.setup();
    render(<Profile />);

    await user.type(screen.getByLabelText("Headline"), "Backend Engineer");
    await user.type(screen.getByLabelText("Summary"), "Ships calmly.");

    expect(useCVStore.getState().data.profile.headline).toBe(
      "Backend Engineer",
    );
    expect(useCVStore.getState().data.profile.summary).toBe("Ships calmly.");
  });
});
