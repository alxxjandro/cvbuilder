# CV Builder — Design Brief

A complete, self-contained brief for designing the product in Claude Design.
Hand this whole file to the design tool. It defines **who it's for, the flows,
the screens, the visual system, and the guardrails** that keep it from looking
templated or AI-generated.

---

## 1. Product in one line

A web app to build **ATS-friendly** CVs: edit your CV through a sectioned
editor, see a live print-ready preview, and keep **multiple CVs** under your
account — including **new ones spun off from an existing CV**.

It is a polished **side project**, not an enterprise suite. Scope stays tight:
no team features, no billing, no admin. Quality bar is high; surface area is
small.

---

## 2. Who it's for

- **Students and early-career people** writing or refreshing a CV.
- **Career switchers** maintaining several tailored versions (e.g. "Backend",
  "Design", "Generalist") of the same base CV.
- They are not designers. The tool must feel effortless, fast, and trustworthy.

**Primary jobs to be done**

1. Sign in quickly (Google).
2. Create a CV from scratch — or **duplicate an existing one and tweak it**.
3. Fill it out section by section without friction.
4. See exactly how it prints, then download (PDF / DOCX).
5. Come back later, find the right CV, keep editing.

---

## 3. Visual direction

**Aesthetic: editorial minimalism with one electric accent.**
Warm, premium, typographic, lots of intentional whitespace — with a single
vivid accent used boldly for actions and highlights. "Flashy" comes from
**confident type, a strong accent, and crisp motion**, never from gradients or
decoration. It should feel like a well-art-directed magazine product, made by a
person with taste.

**Reference vibe:** Linear's precision, Stripe's restraint, a print magazine's
typography. Editorial, not corporate; bold, not loud.

### Color (light mode — primary, ship this first)

| Token           | Value     | Use                                            |
| --------------- | --------- | ---------------------------------------------- |
| `--paper`       | `#FAF8F4` | App background (warm off-white, not pure grey) |
| `--surface`     | `#FFFFFF` | Cards, inputs, preview sheet                   |
| `--ink`         | `#16150F` | Primary text (warm near-black)                 |
| `--ink-muted`   | `#6B675E` | Secondary text, meta, labels                   |
| `--line`        | `#E7E2D8` | Hairline borders, dividers (1px)               |
| `--accent`      | `#2B4CFF` | Electric cobalt — CTAs, focus, active, links   |
| `--accent-ink`  | `#FFFFFF` | Text on accent                                 |
| `--accent-wash` | `#EEF1FF` | Accent-tinted hover/selected backgrounds       |
| `--danger`      | `#D2351F` | Destructive (delete)                           |
| `--success`     | `#1E8E5A` | Saved / positive                               |

One accent only. (If cobalt feels too techy in review, the single alternate to
A/B is a warm **vermilion `#FB3B1E`** — pick one, never both.)

**Dark mode** is a fast-follow, not now. Reserve `#0B0B0F` surface / `#C7FF4B`
or cobalt accent for that pass.

### Typography

- **Display / headlines:** **Fraunces** (variable serif). Use its character —
  high optical size, slightly soft. This is the anti-generic signature.
- **UI / body:** **Inter**. Clean, neutral, legible at small sizes.
- **Meta / labels / dates / tags:** a mono — **Geist Mono** or **JetBrains
  Mono** — uppercase, letter-spaced, small. Editorial detail.

Type scale (rem): `0.75 · 0.875 · 1 · 1.125 · 1.5 · 2 · 3 · 4`.
Headlines tight (`line-height 1.05`, `letter-spacing -0.02em`); body relaxed
(`1.6`). Headlines may be large and asymmetric — left-aligned, not centered.

### Shape, depth, motion

- **Radius:** inputs `6px`, buttons `8px`, cards `12px`. No giant pills.
- **Depth:** prefer **1px `--line` borders** over shadows. Shadows are subtle
  and only on hover/elevated surfaces (`0 1px 2px`, `0 8px 24px -12px`).
- **Motion:** `150–220ms ease-out`. Purposeful only — hover lift `1–2px`,
  accent underline draw on links, content fade/slide-up `8px` on mount, section
  switch crossfade. No bouncing, no parallax, no confetti.
- **Grid:** real 12-col grid, generous gutters, content max-width ~`1200px`.
  Embrace asymmetry and whitespace; don't center everything.

---

## 4. Information architecture

```
/                     Landing (logged out) → "Continue with Google"
/login                Auth (Google) — or as a modal from landing
/dashboard            "My CVs" — grid of the user's CVs
/cv/:id               Editor (two-pane: sections + live preview)
/cv/:id/preview       Full-screen preview / export (optional separate route)
/account              Minimal settings (profile, sign out)
```

Top-level nav is tiny: **logo → dashboard**, and an **account avatar menu**.
Everything else is contextual.

---

## 5. Screen-by-screen specs

### 5.1 Landing (logged out)

Purpose: state the value, get them signed in.

- Left-aligned editorial hero: oversized Fraunces headline ("**Build a CV that
  actually gets read.**"), one-line sub ("ATS-friendly. Free. Yours."), and a
  single primary CTA **"Continue with Google"** with the Google glyph.
- To the right / below: a **real CV preview** mock on a paper sheet, slightly
  tilted, casting a soft shadow — shows the product, not an illustration.
- A slim band of 3 proof points (mono labels): `ATS-READY` · `MULTIPLE CVS` ·
  `PDF & DOCX`.
- Footer: minimal — one line, muted.
- No feature-card soup, no testimonials carousel, no stock illustration.

### 5.2 Auth

- The lightest possible: centered card on `--paper`, logo, one sentence, the
  **Continue with Google** button, tiny legal line. That's it.
- Loading + error states (auth failed → inline message, retry).

### 5.3 Dashboard — "My CVs"

The home base. Header: `My CVs` (Fraunces) + a primary **`+ New CV`** button
top-right; account avatar far right.

- **CV card** (the core component): a small **paper thumbnail** of the actual
  CV, the **title** (editable inline), a mono **`Edited 2d ago`** meta line, and
  a **`⋯` menu**. Hover lifts the card 2px and reveals the menu.
- **Card menu actions:** `Open` · `Rename` · **`Duplicate`** ·
  `Download (PDF/DOCX)` · `Delete`.
- **"Create from existing"** is first-class: it's **`Duplicate`** on a card
  **and** an option in the `+ New CV` flow ("Start blank" vs "Start from an
  existing CV →" which lists their CVs). Duplicating opens the copy in the
  editor, titled "Copy of …".
- **Empty state** (no CVs yet): a friendly, well-set block — Fraunces line
  "Your first CV starts here.", a `+ New CV` button, and a faint paper-sheet
  outline. Never a generic centered icon-and-grey-text.
- **Grid:** responsive cards, 3–4 per row desktop, 1 mobile.
- States: loading (skeleton cards), error (retry), saving/duplicating (subtle
  spinner on the affected card).

### 5.4 Editor

Two-pane workspace. This is where most time is spent — make it calm and fast.

**Top bar (sticky):**

- Left: `← All CVs`, then the **CV title** (click to edit inline).
- Center/!: **autosave indicator** — mono `Saved` / `Saving…` with a tiny dot.
- Right: **`Download`** (split button → PDF / DOCX), then account avatar.

**Left pane — Section editor (~40%, scrolls):**

- A vertical **section nav**: `Profile · Education · Technical Skills ·
Experience · Projects · Soft Skills`, each with a quiet icon; active item
  marked with an accent left-bar + `--accent-wash`.
- The active section shows its form. **List sections** (Education, Experience,
  Projects, Skill groups) use **collapsible entry cards**: header (title +
  expand chevron + drag handle), body with fields, a `Delete` action, and an
  **`+ Add`** button at the bottom.
- **Bullets** (job/project bullets, skill values) are an editable line list:
  each line an input + delete; an add-row with Enter-to-add.
- **Reorder** entries by drag handle (and up/down for a11y).
- Inputs: labeled, generous, `--line` border, accent focus ring. The "currently
  work here" control is a labeled **switch** that disables the end-date field.

**Right pane — Live preview (~60%, sticky):**

- The CV rendered on a **white paper sheet** centered on `--paper`, realistic
  page proportions, soft shadow. Updates live as you type.
- Single-column, standard headings, no tables/columns/icons in the document
  itself — **ATS-safe by construction** (this is the product's whole point).
- A small floating control: zoom / page indicator; `Download` mirrored here.
- Future hook (don't build now, but leave room): a **template/style switcher**
  rail and an **ATS score** badge.

**Mobile:** panes stack — editor first, a **`Preview`** toggle/sheet to see the
sheet. Top bar collapses into a menu.

### 5.5 Account

Minimal: avatar + name + email from Google, and **Sign out**. Maybe default
download format. Nothing more.

---

## 6. Component inventory (map to shadcn/ui, then restyle)

Build on **shadcn/ui** primitives, but **override the theme** so it never reads
as default shadcn (see §8).

| Component      | shadcn base              | Notes                                                                       |
| -------------- | ------------------------ | --------------------------------------------------------------------------- |
| Button         | `button`                 | Variants: `primary` (accent), `secondary` (ink outline), `ghost`, `danger`. |
| Split button   | `button`+`dropdown-menu` | Download → PDF / DOCX.                                                      |
| Card           | `card`                   | CV card + entry cards.                                                      |
| Input/Textarea | `input`,`textarea`       | Accent focus ring, `--line` border.                                         |
| Label          | `label`                  | Small, mono optional.                                                       |
| Section nav    | `tabs` (vertical)        | Accent active state.                                                        |
| Dialog         | `dialog`                 | Rename, Delete-confirm, "New from existing".                                |
| Dropdown menu  | `dropdown-menu`          | Card `⋯`, account, download.                                                |
| Switch         | `switch`                 | "I currently work here".                                                    |
| Toast          | `sonner`                 | Autosave hiccups, errors, "Duplicated".                                     |
| Tooltip        | `tooltip`                | Icon affordances.                                                           |
| Avatar         | `avatar`                 | Google photo / initials.                                                    |
| Skeleton       | `skeleton`               | Dashboard + preview loading.                                                |
| Badge          | `badge`                  | Mono meta tags; future ATS score.                                           |
| Empty state    | custom                   | Editorial, not generic.                                                     |

---

## 7. Content & voice

- **Confident, plain, warm.** Short. No corporate filler, no exclamation
  spam, no emoji in product chrome.
- Buttons are verbs: `New CV`, `Duplicate`, `Download`, `Add experience`.
- Use **real sample copy** in mockups (real-looking job titles, bullets,
  dates) — **never Lorem ipsum**. Lorem is an instant "AI mock" tell.
- Mono microcopy for meta: `EDITED 2D AGO`, `ATS-READY`, `PDF · DOCX`.

---

## 8. Anti-"AI-generated" guardrails (read this twice)

The look must feel **art-directed by a human**. Avoid the tells:

**Don't**

- ❌ Default shadcn slate/zinc palette, or a generic purple/blue gradient hero.
- ❌ Everything centered, everything `rounded-2xl`, everything one card grid.
- ❌ Three identical feature cards with a lucide icon + heading + grey sentence.
- ❌ Glassmorphism, blurry blobs, mesh gradients, neon glows everywhere.
- ❌ Lorem ipsum, placeholder avatars, fake logos, "Acme" copy.
- ❌ Uniform spacing everywhere — that flatness reads as auto-generated.

**Do**

- ✅ One warm paper background + ink + **a single** electric accent.
- ✅ A real type system: Fraunces display + Inter UI + mono meta. Big,
  left-aligned, characterful headlines.
- ✅ Asymmetry, intentional whitespace, a clear typographic hierarchy.
- ✅ 1px hairline borders over heavy shadows; restraint in depth.
- ✅ Show the **actual product** (paper CV sheets) as the hero imagery.
- ✅ Small, precise micro-interactions; nothing decorative.

---

## 9. Accessibility & responsive

- WCAG AA contrast (the warm paper + ink + cobalt set passes; verify accent on
  paper for small text — use `--ink` for body, accent for emphasis/actions).
- Full keyboard path: nav, entry expand, reorder (up/down), dialogs, menus.
- Visible accent focus rings; respect `prefers-reduced-motion`.
- Breakpoints: mobile `<640`, tablet `640–1024`, desktop `>1024`. Editor is
  two-pane ≥1024, stacked below.

---

## 10. What to produce in Claude Design (priority order)

1. **Design tokens + type/color styles** (the system above).
2. **Core components** (§6) in their variants and states.
3. **Dashboard** — populated, empty, loading.
4. **Editor** — Experience section expanded + live preview populated.
5. **Landing** + **Auth**.
6. **Mobile** versions of dashboard and editor.

Deliver each screen with **real content** and all key states (default / hover /
focus / loading / empty / error).

---

## Appendix — existing data model (for realistic mockups)

A CV has: **Profile** (name, email, phone, city, linkedin, github, portfolio),
**Education**, **Technical Skills** (named groups of values), **Experience**
(title, company, dates, "current" flag, bullets), **Projects** (name, link,
date, bullets), **Soft Skills**. Use these exact sections and fields so the
designs match what's built.
