import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import Brand from "../components/Brand";
import Avatar from "../components/Avatar";
import Skeleton from "../components/Skeleton";
import { CVSheet } from "../components/CV";
import { useLibraryStore } from "../state/libraryStore";
import type { LibraryCV } from "../state/libraryStore";
import { useHydrated } from "../hooks/useHydrated";
import { formatEdited } from "../utils/relativeTime";
import "../styles/Dashboard.css";

/**
 * Placeholder grid shown while the library rehydrates from storage.
 */
function DashboardSkeleton() {
  return (
    <div className="cv-grid is-skeleton">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="cv-card-skeleton" key={index}>
          <div className="cv-card-skeleton-thumb skeleton" />
          <div className="cv-card-skeleton-foot">
            <Skeleton width="62%" height={14} />
            <Skeleton width="40%" height={10} />
          </div>
        </div>
      ))}
    </div>
  );
}

const SHEET_WIDTH = 794;
const SHEET_HEIGHT = 1123;

/**
 * A scaled, real rendering of a full CV used as a paper thumbnail. The box is
 * sized to the A4 sheet proportions at the given scale.
 */
function SheetThumb({ cv, scale }: { cv: LibraryCV; scale: number }) {
  return (
    <div
      className="sheet-thumb"
      style={{ width: SHEET_WIDTH * scale, height: SHEET_HEIGHT * scale }}
    >
      <div
        className="sheet-thumb-inner"
        style={{ transform: `scale(${scale})` }}
      >
        <CVSheet data={cv.data} />
      </div>
    </div>
  );
}

/**
 * The role shown for a CV, taken from its headline. Falls back to a neutral
 * placeholder when the document has no headline yet.
 *
 * @param cv - The library entry.
 * @returns The headline or a placeholder string.
 */
function roleOf(cv: LibraryCV): string {
  return cv.data.profile.headline || "No role yet";
}

type View = "grid" | "list";

/**
 * "My CVs" home base: a grid/list of the user's documents with a featured
 * "jump back in" card, plus actions to create, duplicate, open and delete.
 */
function Dashboard() {
  const cvs = useLibraryStore((state) => state.cvs);
  const create = useLibraryStore((state) => state.create);
  const duplicate = useLibraryStore((state) => state.duplicate);
  const remove = useLibraryStore((state) => state.remove);
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const [view, setView] = useState<View>("grid");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const ordered = useMemo(
    () => [...cvs].sort((a, b) => b.updatedAt - a.updatedAt),
    [cvs],
  );
  const featured = ordered[0];

  const handleNew = () => navigate(`/cv/${create()}`);

  const handleDuplicate = (id: string) => {
    const newId = duplicate(id);
    setOpenMenu(null);
    if (newId) navigate(`/cv/${newId}`);
  };

  const handleDelete = (id: string) => {
    setOpenMenu(null);
    remove(id);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-topbar">
        <Brand to="/dashboard" />
        <Avatar />
      </header>

      <main className="dashboard-body">
        <div className="dashboard-head">
          <div>
            <h1 className="dashboard-title">My CVs</h1>
            <div className="mono dashboard-count">
              {cvs.length} {cvs.length === 1 ? "DOCUMENT" : "DOCUMENTS"}
            </div>
          </div>
          <div className="dashboard-actions">
            {cvs.length > 0 && (
              <div className="view-toggle">
                <button
                  type="button"
                  className={`view-toggle-tab${view === "grid" ? " is-active" : ""}`}
                  onClick={() => setView("grid")}
                >
                  Grid
                </button>
                <button
                  type="button"
                  className={`view-toggle-tab${view === "list" ? " is-active" : ""}`}
                  onClick={() => setView("list")}
                >
                  List
                </button>
              </div>
            )}
            <button
              type="button"
              className="btn btn-primary dashboard-new"
              onClick={handleNew}
            >
              <FiPlus className="dashboard-new-plus" aria-hidden="true" /> New
              CV
            </button>
          </div>
        </div>

        {!hydrated ? (
          <DashboardSkeleton />
        ) : cvs.length === 0 ? (
          <div className="dashboard-empty">
            <div className="dashboard-empty-sheet" />
            <h2 className="dashboard-empty-title">
              Your first CV starts here.
            </h2>
            <p className="dashboard-empty-body">
              Build a clean, ATS-ready CV that recruiters and parsers both read
              with ease. Everything you add is saved as you go.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNew}
            >
              <FiPlus className="dashboard-new-plus" aria-hidden="true" /> New
              CV
            </button>
          </div>
        ) : (
          <>
            <div className="dashboard-featured">
              <div className="dashboard-featured-thumb">
                <SheetThumb cv={featured} scale={0.0806} />
              </div>
              <div className="dashboard-featured-copy">
                <div className="mono dashboard-featured-eyebrow">
                  Jump back in
                </div>
                <div className="dashboard-featured-title">{featured.title}</div>
                <div className="mono dashboard-featured-meta">
                  {formatEdited(featured.updatedAt)}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => navigate(`/cv/${featured.id}`)}
              >
                Continue editing
              </button>
            </div>

            <div className="mono dashboard-all-label">All CVs</div>

            {view === "grid" ? (
              <div className="cv-grid">
                {ordered.map((cv) => (
                  <div
                    className="cv-card"
                    key={cv.id}
                    onClick={() => navigate(`/cv/${cv.id}`)}
                  >
                    <div className="cv-card-thumb">
                      <SheetThumb cv={cv} scale={0.24} />
                    </div>
                    <div className="cv-card-foot">
                      <div className="cv-card-text">
                        <div className="cv-card-title">{cv.title}</div>
                        <div className="mono cv-card-meta">
                          {formatEdited(cv.updatedAt)}
                        </div>
                      </div>
                      <div className="cv-card-menu-wrap">
                        <button
                          type="button"
                          className="cv-card-menu-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(openMenu === cv.id ? null : cv.id);
                          }}
                          aria-label="CV actions"
                        >
                          <FiMoreHorizontal aria-hidden="true" />
                        </button>
                        {openMenu === cv.id && (
                          <CardMenu
                            onOpen={() => navigate(`/cv/${cv.id}`)}
                            onDuplicate={() => handleDuplicate(cv.id)}
                            onDelete={() => handleDelete(cv.id)}
                            onClose={() => setOpenMenu(null)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cv-list">
                {ordered.map((cv) => (
                  <div
                    className="cv-row"
                    key={cv.id}
                    onClick={() => navigate(`/cv/${cv.id}`)}
                  >
                    <div className="cv-row-mini">
                      <SheetThumb cv={cv} scale={0.0453} />
                    </div>
                    <div className="cv-row-text">
                      <div className="cv-row-title">{cv.title}</div>
                      <div className="mono cv-row-role">{roleOf(cv)}</div>
                    </div>
                    <div className="mono cv-row-meta">
                      {formatEdited(cv.updatedAt)}
                    </div>
                    <div
                      className="cv-row-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="cv-row-open"
                        onClick={() => navigate(`/cv/${cv.id}`)}
                      >
                        Open
                      </button>
                      <div className="cv-card-menu-wrap">
                        <button
                          type="button"
                          className="cv-card-menu-btn"
                          onClick={() =>
                            setOpenMenu(openMenu === cv.id ? null : cv.id)
                          }
                          aria-label="CV actions"
                        >
                          <FiMoreHorizontal aria-hidden="true" />
                        </button>
                        {openMenu === cv.id && (
                          <CardMenu
                            onOpen={() => navigate(`/cv/${cv.id}`)}
                            onDuplicate={() => handleDuplicate(cv.id)}
                            onDelete={() => handleDelete(cv.id)}
                            onClose={() => setOpenMenu(null)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/**
 * Props for the per-card actions menu.
 */
interface CardMenuProps {
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

/**
 * Dropdown of actions for a single CV: open, duplicate and delete.
 */
function CardMenu({ onOpen, onDuplicate, onDelete, onClose }: CardMenuProps) {
  return (
    <>
      <div className="cv-menu-backdrop" onClick={onClose} />
      <div className="cv-menu" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="cv-menu-item" onClick={onOpen}>
          Open
        </button>
        <button type="button" className="cv-menu-item" onClick={onDuplicate}>
          Duplicate
        </button>
        <button
          type="button"
          className="cv-menu-item is-danger"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </>
  );
}

export default Dashboard;
