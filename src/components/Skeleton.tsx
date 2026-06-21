import type { CSSProperties } from "react";

/**
 * Props for the skeleton placeholder.
 */
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
}

/**
 * A single shimmering placeholder block shown while real content loads. Sizes
 * default to a short text line.
 */
function Skeleton({
  width = "100%",
  height = 12,
  radius = 6,
  className = "",
}: SkeletonProps) {
  const style: CSSProperties = {
    width,
    height,
    borderRadius: radius,
  };
  return <span className={`skeleton ${className}`.trim()} style={style} />;
}

export default Skeleton;
