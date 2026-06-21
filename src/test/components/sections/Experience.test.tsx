import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Experience from "../../../components/sections/Experience";
import { useCVStore } from "../../../state/cvStore";
import { createEmptyCV } from "../../../model/cv";

beforeEach(() => {
  useCVStore.getState().load(createEmptyCV());
});

describe("Experience", () => {
  it("adds, edits and deletes an experience entry end to end", async () => {
    const user = userEvent.setup();
    render(<Experience />);

    await user.click(screen.getByRole("button", { name: "Add Experience" }));
    expect(screen.getByText("Untitled Experience")).toBeInTheDocument();

    await user.click(screen.getByText("Untitled Experience"));
    const jobTitle = screen.getByLabelText("Job Title");
    await user.type(jobTitle, "Engineer");
    expect(jobTitle).toHaveValue("Engineer");

    const bulletInput = screen.getByPlaceholderText(
      "Add job description bullet",
    );
    await user.type(bulletInput, "Shipped a feature");
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByDisplayValue("Shipped a feature")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.queryByLabelText("Job Title")).not.toBeInTheDocument();
  });

  it("disables the end date when marked as current", async () => {
    const user = userEvent.setup();
    render(<Experience />);

    await user.click(screen.getByRole("button", { name: "Add Experience" }));
    await user.click(screen.getByText("Untitled Experience"));

    const current = screen.getByLabelText("I currently work here");
    await user.click(current);

    expect(screen.getByLabelText("To")).toBeDisabled();
  });
});
