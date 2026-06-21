import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App, { AppRoutes } from "../../components/App";
import { useAuthStore } from "../../state/authStore";
import { useLibraryStore } from "../../state/libraryStore";

beforeEach(() => {
  useAuthStore.getState().signOut();
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
    useAuthStore.getState().signIn();
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "My CVs" })).toBeInTheDocument();
  });

  it("opens a CV in the editor", () => {
    useAuthStore.getState().signIn();
    const id = useLibraryStore.getState().cvs[0].id;
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
