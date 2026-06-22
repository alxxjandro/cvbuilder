import type {
  CVData,
  Education,
  Experience,
  ListSection,
  Profile,
  Project,
  SectionEntryMap,
  SkillGroup,
  SoftSkill,
  TemplateId,
} from "../types/cv";

/**
 * The template a document falls back to when none is recorded (for example a
 * row created before templates existed).
 */
export const DEFAULT_TEMPLATE: TemplateId = "classic";

/**
 * Generates a stable, unique identifier for a list entry.
 *
 * @returns A RFC-4122 UUID string.
 */
function newId(): string {
  return crypto.randomUUID();
}

/**
 * Creates an empty {@link Profile} with all fields blank.
 *
 * @returns A fresh, empty profile.
 */
export function createEmptyProfile(): Profile {
  return {
    firstName: "",
    lastName: "",
    headline: "",
    summary: "",
    email: "",
    phoneNumber: "",
    city: "",
    linkedin: "",
    github: "",
    portfolio: "",
  };
}

/**
 * Creates a blank {@link Education} entry with a fresh id.
 *
 * @returns A fresh, empty education entry.
 */
export function createEducation(): Education {
  return {
    id: newId(),
    schoolName: "",
    degreeName: "",
    degreeCity: "",
    startDate: "",
    endDate: "",
    extraNotes: "",
  };
}

/**
 * Creates a blank {@link SkillGroup} entry with a fresh id.
 *
 * @returns A fresh, empty skill group.
 */
export function createSkillGroup(): SkillGroup {
  return { id: newId(), groupName: "", groupValues: [] };
}

/**
 * Creates a blank {@link Experience} entry with a fresh id.
 *
 * @returns A fresh, empty experience entry.
 */
export function createExperience(): Experience {
  return {
    id: newId(),
    jobTitle: "",
    companyName: "",
    location: "",
    fromDate: "",
    toDate: "",
    current: false,
    bullets: [],
  };
}

/**
 * Creates a blank {@link Project} entry with a fresh id.
 *
 * @returns A fresh, empty project entry.
 */
export function createProject(): Project {
  return { id: newId(), projectName: "", link: "", date: "", bullets: [] };
}

/**
 * Creates a blank {@link SoftSkill} entry with a fresh id.
 *
 * @returns A fresh, empty soft skill entry.
 */
export function createSoftSkill(): SoftSkill {
  return { id: newId(), skill: "" };
}

/**
 * Creates a blank entry for the given list section, typed to that section.
 *
 * @param section - The list section to create an entry for.
 * @returns A fresh entry matching the section's element type.
 */
export function createEntry<S extends ListSection>(
  section: S,
): SectionEntryMap[S] {
  switch (section) {
    case "education":
      return createEducation() as SectionEntryMap[S];
    case "skillGroups":
      return createSkillGroup() as SectionEntryMap[S];
    case "experience":
      return createExperience() as SectionEntryMap[S];
    case "projects":
      return createProject() as SectionEntryMap[S];
    case "softSkills":
      return createSoftSkill() as SectionEntryMap[S];
    default: {
      const exhaustive: never = section;
      throw new Error(`Unknown section: ${String(exhaustive)}`);
    }
  }
}

/**
 * Creates a complete, empty {@link CVData} document.
 *
 * @returns A fresh CV with an empty profile and no entries.
 */
export function createEmptyCV(): CVData {
  return {
    templateId: DEFAULT_TEMPLATE,
    profile: createEmptyProfile(),
    education: [],
    skillGroups: [],
    experience: [],
    projects: [],
    softSkills: [],
  };
}

/**
 * Normalizes a loaded document, backfilling any fields absent from older
 * persisted rows so the rest of the app can assume a complete {@link CVData}.
 * In particular, rows saved before templates existed gain the default
 * template.
 *
 * @param data - A document loaded from storage, possibly missing newer fields.
 * @returns A complete {@link CVData} safe to render and edit.
 */
export function withDefaults(data: CVData): CVData {
  return {
    ...data,
    templateId: data.templateId ?? DEFAULT_TEMPLATE,
  };
}

/**
 * Demo CV used as seed data for local development and tests. Uses realistic
 * sample content so the live preview matches the editorial design mockup.
 */
export const SAMPLE_CV: CVData = {
  templateId: "classic",
  profile: {
    firstName: "Maya",
    lastName: "Okonkwo",
    headline: "Backend Engineer",
    summary:
      "Backend engineer with six years building high-throughput payment and data systems. I care about correctness, clean interfaces, and shipping calmly under load.",
    email: "maya.okonkwo@gmail.com",
    phoneNumber: "+49 30 5550 1487",
    city: "Berlin, DE",
    linkedin: "in/mayaok",
    github: "github.com/mayaokonkwo",
    portfolio: "",
  },
  education: [
    {
      id: newId(),
      schoolName: "Technische Universität Berlin",
      degreeName: "B.Sc. Computer Science",
      degreeCity: "Berlin, DE",
      startDate: "2015-09-01",
      endDate: "2019-06-01",
      extraNotes:
        "Thesis on distributed consensus. Graduated with distinction.",
    },
  ],
  skillGroups: [
    {
      id: newId(),
      groupName: "Languages",
      groupValues: ["Python", "Go", "TypeScript", "SQL"],
    },
    {
      id: newId(),
      groupName: "Infrastructure",
      groupValues: ["Docker", "Kubernetes", "AWS", "Terraform"],
    },
    {
      id: newId(),
      groupName: "Data",
      groupValues: ["PostgreSQL", "Redis", "Kafka", "ClickHouse"],
    },
  ],
  experience: [
    {
      id: newId(),
      jobTitle: "Senior Backend Engineer",
      companyName: "Klarna",
      location: "Berlin, DE",
      fromDate: "2022-03-01",
      toDate: "",
      current: true,
      bullets: [
        "Led migration of the payments ledger from a Python monolith to event-sourced Go services, cutting settlement latency 38%.",
        "Designed an idempotent webhook pipeline processing 4M events/day with exactly-once delivery on Kafka.",
        "Mentored four engineers and owned the team's on-call rotation and incident-review practice.",
      ],
    },
    {
      id: newId(),
      jobTitle: "Backend Engineer",
      companyName: "SoundCloud",
      location: "Berlin, DE",
      fromDate: "2019-06-01",
      toDate: "2022-02-01",
      current: false,
      bullets: [
        "Built the recommendation API serving 90M monthly listeners at a sustained p99 under 80ms.",
        "Introduced consumer-driven contract testing across 12 services, halving integration regressions.",
      ],
    },
  ],
  projects: [
    {
      id: newId(),
      projectName: "ledger-kit",
      link: "github.com/mayaokonkwo/ledger-kit",
      date: "2024-01-01",
      bullets: [
        "Open-source double-entry accounting library in Go. 1.2k stars.",
      ],
    },
    {
      id: newId(),
      projectName: "latency-lab",
      link: "latencylab.dev",
      date: "2023-01-01",
      bullets: [
        "Interactive playground for visualizing tail latency under load.",
      ],
    },
  ],
  softSkills: [
    { id: newId(), skill: "Technical writing" },
    { id: newId(), skill: "Mentorship" },
    { id: newId(), skill: "Incident command" },
    { id: newId(), skill: "Stakeholder communication" },
  ],
};

/**
 * Frontend-tailored sample CV. Same person as {@link SAMPLE_CV}, retargeted at
 * a frontend role to illustrate the product's "one base CV, many versions"
 * idea.
 */
export const SAMPLE_FRONTEND: CVData = {
  templateId: "modern",
  profile: {
    firstName: "Maya",
    lastName: "Okonkwo",
    headline: "Frontend Engineer",
    summary:
      "Frontend engineer who turns dense product surfaces into calm, fast interfaces. I care about accessibility, design systems, and shipping polished UI under real constraints.",
    email: "maya.okonkwo@gmail.com",
    phoneNumber: "+49 30 5550 1487",
    city: "Berlin, DE",
    linkedin: "in/mayaok",
    github: "github.com/mayaokonkwo",
    portfolio: "mayaok.dev",
  },
  education: [
    {
      id: newId(),
      schoolName: "Technische Universität Berlin",
      degreeName: "B.Sc. Computer Science",
      degreeCity: "Berlin, DE",
      startDate: "2015-09-01",
      endDate: "2019-06-01",
      extraNotes:
        "Focus on human-computer interaction. Graduated with distinction.",
    },
  ],
  skillGroups: [
    {
      id: newId(),
      groupName: "Languages",
      groupValues: ["TypeScript", "JavaScript", "HTML", "CSS"],
    },
    {
      id: newId(),
      groupName: "Frameworks",
      groupValues: ["React", "Next.js", "Vue", "Vite"],
    },
    {
      id: newId(),
      groupName: "Craft",
      groupValues: [
        "Design systems",
        "Accessibility",
        "Testing",
        "Performance",
      ],
    },
  ],
  experience: [
    {
      id: newId(),
      jobTitle: "Senior Frontend Engineer",
      companyName: "Klarna",
      location: "Berlin, DE",
      fromDate: "2022-03-01",
      toDate: "",
      current: true,
      bullets: [
        "Led the rebuild of the checkout UI in React, lifting conversion 6% and cutting bundle size 40%.",
        "Owned the shared component library used by 30 engineers, with full keyboard and screen-reader support.",
        "Set up visual regression and Lighthouse budgets in CI to keep performance from drifting.",
      ],
    },
    {
      id: newId(),
      jobTitle: "Frontend Engineer",
      companyName: "SoundCloud",
      location: "Berlin, DE",
      fromDate: "2019-06-01",
      toDate: "2022-02-01",
      current: false,
      bullets: [
        "Built the responsive web player serving 90M monthly listeners.",
        "Migrated a legacy Backbone surface to React without a feature freeze.",
      ],
    },
  ],
  projects: [
    {
      id: newId(),
      projectName: "motion-kit",
      link: "github.com/mayaokonkwo/motion-kit",
      date: "2024-01-01",
      bullets: ["Tiny, accessible React animation primitives. 800 stars."],
    },
    {
      id: newId(),
      projectName: "a11y-lab",
      link: "a11ylab.dev",
      date: "2023-01-01",
      bullets: ["Interactive lessons on building accessible components."],
    },
  ],
  softSkills: [
    { id: newId(), skill: "Design collaboration" },
    { id: newId(), skill: "Mentorship" },
    { id: newId(), skill: "Technical writing" },
    { id: newId(), skill: "Stakeholder communication" },
  ],
};

/**
 * Full-stack-tailored sample CV. Same person as {@link SAMPLE_CV}, balanced
 * across product, frontend and backend.
 */
export const SAMPLE_FULLSTACK: CVData = {
  templateId: "classic",
  profile: {
    firstName: "Maya",
    lastName: "Okonkwo",
    headline: "Full-stack Engineer",
    summary:
      "Full-stack engineer comfortable from database to interface. I like owning features end to end, keeping systems simple, and shipping things people actually use.",
    email: "maya.okonkwo@gmail.com",
    phoneNumber: "+49 30 5550 1487",
    city: "Berlin, DE",
    linkedin: "in/mayaok",
    github: "github.com/mayaokonkwo",
    portfolio: "mayaok.dev",
  },
  education: [
    {
      id: newId(),
      schoolName: "Technische Universität Berlin",
      degreeName: "B.Sc. Computer Science",
      degreeCity: "Berlin, DE",
      startDate: "2015-09-01",
      endDate: "2019-06-01",
      extraNotes: "Graduated with distinction.",
    },
  ],
  skillGroups: [
    {
      id: newId(),
      groupName: "Languages",
      groupValues: ["TypeScript", "Go", "Python", "SQL"],
    },
    {
      id: newId(),
      groupName: "Frontend",
      groupValues: ["React", "Next.js", "Tailwind"],
    },
    {
      id: newId(),
      groupName: "Backend",
      groupValues: ["Node", "PostgreSQL", "Redis", "Docker"],
    },
  ],
  experience: [
    {
      id: newId(),
      jobTitle: "Senior Full-stack Engineer",
      companyName: "Klarna",
      location: "Berlin, DE",
      fromDate: "2022-03-01",
      toDate: "",
      current: true,
      bullets: [
        "Shipped the merchant dashboard end to end: React frontend, Go API, and Postgres schema.",
        "Cut a critical reporting flow from 9s to under 1s with query and caching work.",
        "Mentored two engineers across the stack and ran the feature's on-call.",
      ],
    },
    {
      id: newId(),
      jobTitle: "Software Engineer",
      companyName: "SoundCloud",
      location: "Berlin, DE",
      fromDate: "2019-06-01",
      toDate: "2022-02-01",
      current: false,
      bullets: [
        "Built features across the web player and its recommendation API.",
        "Introduced typed end-to-end contracts between frontend and services.",
      ],
    },
  ],
  projects: [
    {
      id: newId(),
      projectName: "stackstarter",
      link: "github.com/mayaokonkwo/stackstarter",
      date: "2024-01-01",
      bullets: ["Opinionated full-stack TypeScript starter. 1k stars."],
    },
    {
      id: newId(),
      projectName: "latency-lab",
      link: "latencylab.dev",
      date: "2023-01-01",
      bullets: [
        "Interactive playground for visualizing tail latency under load.",
      ],
    },
  ],
  softSkills: [
    { id: newId(), skill: "Product thinking" },
    { id: newId(), skill: "Mentorship" },
    { id: newId(), skill: "Technical writing" },
    { id: newId(), skill: "Ownership" },
  ],
};

/**
 * One titled starter document for seeding a fresh library.
 */
export interface SampleEntry {
  title: string;
  data: CVData;
}

/**
 * Starter library shown to a brand-new user: three tailored versions of the
 * same base CV. These are real, editable documents, not throwaway mock rows.
 */
export const SAMPLE_LIBRARY: SampleEntry[] = [
  { title: "Backend Engineer", data: SAMPLE_CV },
  { title: "Frontend Engineer", data: SAMPLE_FRONTEND },
  { title: "Full-stack Engineer", data: SAMPLE_FULLSTACK },
];
