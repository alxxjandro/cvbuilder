import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App, { AppRoutes } from "../../components/App";
import { useAuthStore } from "../../state/authStore";
import { useLibraryStore } from "../../state/libraryStore";
import { createEmptyCV } from "../../model/cv";

const TEST_USER = {
  name: "Test User",
  email: "test@example.com",
  initials: "TU",
};

beforeEach(() => {
  // Reset to a resolved, signed-out session with an empty, loaded library.
  useAuthStore.setState({ user: null, ready: true });
  useLibraryStore.setState({ cvs: [], loaded: true });
});

describe("App routing", () => {
  it("shows the landing hero when logged out", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", {
        name: "Build a CV that actually gets read.",
      }),
    ).toBeInTheDocument();
  });

  it("redirects guarded routes to the landing page when logged out", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: "Build a CV that actually gets read.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the dashboard for a signed-in user", () => {
    useAuthStore.setState({ user: TEST_USER, ready: true });
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "My CVs" })).toBeInTheDocument();
  });

  it("opens a CV in the editor", () => {
    const id = crypto.randomUUID();
    useAuthStore.setState({ user: TEST_USER, ready: true });
    useLibraryStore.setState({
      cvs: [
        { id, title: "Test CV", updatedAt: Date.now(), data: createEmptyCV() },
      ],
      loaded: true,
    });
    render(
      <MemoryRouter initialEntries={[`/cv/${id}`]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "Profile" }),
    ).toBeInTheDocument();
  });
});
