import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiChevronDown, FiMinus, FiPlus } from "react-icons/fi";
import Avatar from "../components/Avatar";
import Skeleton from "../components/Skeleton";
import { CVSheet } from "../components/CV";
import Profile from "../components/sections/Profile";
import Education from "../components/sections/Education";
import TechnicalSkills from "../components/sections/TechnicalSkills";
import Experience from "../components/sections/Experience";
import Projects from "../components/sections/Projects";
import SoftSkills from "../components/sections/SoftSkills";
import { useCVStore } from "../state/cvStore";
import { useLibraryStore } from "../state/libraryStore";
import type { CVData } from "../types/cv";
import "../styles/Editor.css";

const SHEET_WIDTH = 794;

/**
 * Skeleton placeholder shown in the form pane while the document loads.
 */
function FormSkeleton() {
  return (
    <div className="editor-form-skeleton">
      <Skeleton width="40%" height={28} />
      <Skeleton height={44} />
      <Skeleton height={44} />
      <Skeleton width="70%" height={44} />
      <Skeleton height={88} />
    </div>
  );
}

/**
 * A navigable editor section: its rail label, the form component, and the
 * document key used to show a live entry count (omitted for the profile).
 */
interface SectionDef {
  short: string;
  label: string;
  component: ComponentType;
  countKey?: keyof CVData;
}

const SECTIONS: SectionDef[] = [
  { short: "PROF", label: "Profile", component: Profile },
  {
    short: "EDU",
    label: "Education",
    component: Education,
    countKey: "education",
  },
  {
    short: "SKILL",
    label: "Technical Skills",
    component: TechnicalSkills,
    countKey: "skillGroups",
  },
  {
    short: "EXP",
    label: "Experience",
    component: Experience,
    countKey: "experience",
  },
  {
    short: "PROJ",
    label: "Projects",
    component: Projects,
    countKey: "projects",
  },
  {
    short: "SOFT",
    label: "Soft Skills",
    component: SoftSkills,
    countKey: "softSkills",
  },
];

const ZOOM_MIN = 0.6;
const ZOOM_MAX = 1.4;
const ZOOM_STEP = 0.1;

/**
 * Pads a section index to the two-digit ordinal used across the design.
 *
 * @param index - Zero-based section index.
 * @returns The 1-based, zero-padded ordinal (for example `"04"`).
 */
function ordinal(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/**
 * Two-pane CV editor: an icon rail and section form on the left, the live
 * paper preview on the right. Loads the document identified by the route into
 * the working store and mirrors every edit back into the library.
 */
function Editor() {
  const { id } = useParams();
  const cv = useLibraryStore((state) => state.cvs.find((c) => c.id === id));
  const rename = useLibraryStore((state) => state.rename);
  const data = useCVStore((state) => state.data);

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fit, setFit] = useState(0.7);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const entry = useLibraryStore.getState().cvs.find((c) => c.id === id);
    if (entry) useCVStore.getState().load(structuredClone(entry.data));
    setReady(true);
  }, [id]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const available = node.clientWidth - 48;
      setFit(Math.min(1, Math.max(0.3, available / SHEET_WIDTH)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = useCVStore.subscribe((state) => {
      useLibraryStore.getState().save(id, state.data);
      setSaving(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaving(false), 800);
    });
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
      unsubscribe();
    };
  }, [id]);

  if (!cv) return <Navigate to="/dashboard" replace />;

  const active = SECTIONS[activeIndex];
  const ActiveSection = active.component;
  const entryCount = active.countKey
    ? (data[active.countKey] as unknown[]).length
    : null;

  const handleDownloadPdf = () => {
    setDownloadOpen(false);
    window.print();
  };

  return (
    <div className="editor">
      <header className="editor-topbar">
        <Link to="/dashboard" className="editor-back">
          <FiArrowLeft aria-hidden="true" />
          All CVs
        </Link>
        <div className="editor-divider" />
        {editingTitle ? (
          <input
            className="editor-title-input"
            value={cv.title}
            autoFocus
            onChange={(e) => rename(cv.id, e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditingTitle(false);
            }}
          />
        ) : (
          <button
            type="button"
            className="editor-title"
            onClick={() => setEditingTitle(true)}
          >
            {cv.title}
          </button>
        )}
        <div className="editor-save">
          <span className={`editor-save-dot${saving ? " is-saving" : ""}`} />
          <span className="mono editor-save-label">
            {saving ? "SAVING…" : "SAVED"}
          </span>
        </div>
        <div className="editor-download">
          <button
            type="button"
            className="editor-download-main"
            onClick={handleDownloadPdf}
          >
            Download
          </button>
          <button
            type="button"
            className="editor-download-caret"
            onClick={() => setDownloadOpen((open) => !open)}
            aria-label="Download options"
          >
            <FiChevronDown aria-hidden="true" />
          </button>
          {downloadOpen && (
            <>
              <div
                className="editor-download-backdrop"
                onClick={() => setDownloadOpen(false)}
              />
              <div className="editor-download-menu">
                <button
                  type="button"
                  className="editor-download-item"
                  onClick={handleDownloadPdf}
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  className="editor-download-item is-disabled"
                  disabled
                >
                  Download DOCX
                  <span className="editor-download-soon">SOON</span>
                </button>
              </div>
            </>
          )}
        </div>
        <Avatar />
      </header>

      <div className="editor-workspace">
        <nav className="editor-rail">
          {SECTIONS.map((section, index) => (
            <button
              type="button"
              key={section.short}
              className={`editor-rail-item${index === activeIndex ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="editor-rail-num">{ordinal(index)}</span>
              <span className="editor-rail-label">{section.short}</span>
            </button>
          ))}
        </nav>

        <section className="editor-pane editor-form-pane">
          <div className="mono editor-section-kicker">
            Section {ordinal(activeIndex)}
          </div>
          <div className="editor-section-head">
            <h2 className="editor-section-title">{active.label}</h2>
            {entryCount !== null && (
              <span className="mono editor-section-count">
                {entryCount} {entryCount === 1 ? "ENTRY" : "ENTRIES"}
              </span>
            )}
          </div>
          <div className="editor-form">
            {ready ? <ActiveSection /> : <FormSkeleton />}
          </div>
        </section>

        <section className="editor-pane editor-preview-pane">
          <div className="editor-preview-scroll" ref={scrollRef}>
            {ready ? (
              <div className="editor-page" style={{ zoom: fit * zoom }}>
                <CVSheet />
              </div>
            ) : (
              <div
                className="editor-page-skeleton skeleton"
                style={{ zoom: fit }}
              />
            )}
          </div>
          <div className="editor-zoom">
            <button
              type="button"
              className="editor-zoom-btn"
              onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
              aria-label="Zoom out"
            >
              <FiMinus aria-hidden="true" />
            </button>
            <span className="mono editor-zoom-value">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="editor-zoom-btn"
              onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
              aria-label="Zoom in"
            >
              <FiPlus aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Editor;
