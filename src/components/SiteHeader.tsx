import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Avatar from "./Avatar";
import { useAuthStore } from "../state/authStore";
import "../styles/Landing.css";

/**
 * The marketing navigation links, shown centered in the header on the public
 * pages.
 */
const NAV_LINKS = [
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/templates", label: "Templates" },
];

/**
 * Shared top navigation for the public marketing pages: the Currio wordmark,
 * the centered section links, and a sign-in (or dashboard) action. On narrow
 * screens the links collapse into a toggleable mobile menu so navigation never
 * disappears. Kept in one place so the landing and the Features / How it works
 * / Templates pages stay in sync.
 */
function SiteHeader() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleSignOut = () => {
    close();
    signOut();
    navigate("/");
  };

  return (
    <header className="landing-nav">
      <Link to="/" className="landing-logo" onClick={close}>
        Currio
      </Link>

      <nav className="landing-nav-links" aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `landing-nav-link${isActive ? " is-active" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="landing-nav-actions">
        {user ? (
          <>
            <Link to="/dashboard" className="landing-dash-btn">
              Go to dashboard
            </Link>
            <Avatar />
          </>
        ) : (
          <Link to="/login" className="landing-signin">
            Sign in
          </Link>
        )}
      </div>

      <button
        type="button"
        className="landing-nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
      </button>

      {open && (
        <>
          <div className="landing-nav-scrim" onClick={close} />
          <div className="landing-nav-mobile">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={close}
                className={({ isActive }) =>
                  `landing-nav-mobile-link${isActive ? " is-active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="landing-nav-mobile-auth">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="landing-dash-btn"
                    onClick={close}
                  >
                    Go to dashboard
                  </Link>
                  <button
                    type="button"
                    className="landing-nav-mobile-signout"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary landing-nav-mobile-signin"
                  onClick={close}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default SiteHeader;
