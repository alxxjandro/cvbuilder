import { Link } from "react-router-dom";

/**
 * Props for the wordmark.
 */
interface BrandProps {
  to?: string;
}

/**
 * The Currio wordmark: a square "C" mark next to the name. Links to `to`
 * (the landing page by default).
 */
function Brand({ to = "/" }: BrandProps) {
  return (
    <Link to={to} className="brand">
      <span className="brand-name">Currio</span>
    </Link>
  );
}

export default Brand;
