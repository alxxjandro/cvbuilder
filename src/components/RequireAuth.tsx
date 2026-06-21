import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../state/authStore";

/**
 * Props for the auth guard.
 */
interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Route guard that renders its children only for a signed-in user and
 * otherwise sends visitors to the landing page, where they can choose to sign
 * in. This keeps the marketing page, not the bare login form, as the default
 * first impression.
 */
function RequireAuth({ children }: RequireAuthProps) {
  const user = useAuthStore((state) => state.user);
  const ready = useAuthStore((state) => state.ready);

  // While the initial Supabase session is still resolving, render nothing so
  // the post-OAuth redirect does not briefly bounce through the landing page.
  if (!ready) return null;
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default RequireAuth;
