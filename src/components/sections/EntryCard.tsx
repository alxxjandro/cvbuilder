import type { ReactNode } from "react";

/**
 * Props for a collapsible entry card.
 */
interface EntryCardProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  children: ReactNode;
}

/**
 * Collapsible card with a clickable header (title + expand/collapse), a body
 * shown only when expanded, and a delete action. Shared by the list sections.
 */
function EntryCard({
  title,
  expanded,
  onToggle,
  onDelete,
  children,
}: EntryCardProps) {
  return (
    <div className="entry-card">
      <div className="entry-header" onClick={onToggle}>
        <h3>{title}</h3>
        <button type="button" className="toggle-btn">
          {expanded ? "−" : "+"}
        </button>
      </div>

      {expanded && (
        <div className="entry-content">
          {children}
          <button type="button" className="delete-entry-btn" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default EntryCard;
