import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../state/authStore";

/**
 * Account avatar showing the user's initials. Clicking it opens a small menu
 * with the account identity and a sign-out action.
 */
function Avatar() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    setOpen(false);
    signOut();
    navigate("/");
  };

  return (
    <div className="avatar-wrap">
      <button
        type="button"
        className="avatar"
        onClick={() => setOpen((value) => !value)}
        aria-label="Account menu"
      >
        {user?.initials ?? "··"}
      </button>
      {open && (
        <>
          <div className="avatar-backdrop" onClick={() => setOpen(false)} />
          <div className="avatar-menu">
            <div className="avatar-menu-name">{user?.name}</div>
            <div className="avatar-menu-email">{user?.email}</div>
            <button
              type="button"
              className="avatar-menu-action"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Avatar;
