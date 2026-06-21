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
} from "../types/cv";

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
    profile: createEmptyProfile(),
    education: [],
    skillGroups: [],
    experience: [],
    projects: [],
    softSkills: [],
  };
}

/**
 * Demo CV used as seed data for local development and tests. Mirrors the
 * dummy content that previously lived inline in the App component.
 */
export const SAMPLE_CV: CVData = {
  profile: {
    firstName: "Hey",
    lastName: "Stranger",
    email: "dummyMail@notreal.com",
    phoneNumber: "123-456-7890",
    city: "Madrid, Spain",
    linkedin: "linkedin.com/in/heyStranger",
    github: "github.com/heyStranger",
    portfolio: "heyStranger.com",
  },
  education: [
    {
      id: newId(),
      schoolName: "Random School",
      degreeName: "A pretty cool degree",
      degreeCity: "Italy",
      startDate: "2018-09-01",
      endDate: "2022-06-01",
      extraNotes: "I had a pretty good time!",
    },
  ],
  skillGroups: [
    {
      id: newId(),
      groupName: "Programming Languages",
      groupValues: ["Javascript", "C++", "Python", "MySQL"],
    },
    {
      id: newId(),
      groupName: "Operating Systems",
      groupValues: ["Linux", "MacOS", "Windows"],
    },
    {
      id: newId(),
      groupName: "Other Software",
      groupValues: ["Figma", "Adobe Suite", "Microsoft Suite", "Davinci Resolve"],
    },
  ],
  experience: [
    {
      id: newId(),
      jobTitle: "Front-end Developer Intern",
      companyName: "Spotify",
      fromDate: "2023-01-01",
      toDate: "2023-04-01",
      current: false,
      bullets: [
        "Proposed and developed new UIs for the platform",
        "Led a team of 4 people during 3 months",
      ],
    },
    {
      id: newId(),
      jobTitle: "Full-stack Junior Developer",
      companyName: "Google",
      fromDate: "2023-05-01",
      toDate: "",
      current: true,
      bullets: [
        "Handled complex queries and optimized the search engine",
        "Updated YouTube's UI for mobile devices",
      ],
    },
  ],
  projects: [
    {
      id: newId(),
      projectName: "Personal Portfolio",
      link: "https://www.heyStranger.com/portfolio",
      date: "2024-02-01",
      bullets: [
        "Built with React and Vite",
        "Deployed on Vercel with custom domain",
        "Features dynamic theming and responsive design",
      ],
    },
    {
      id: newId(),
      projectName: "Weather App",
      link: "https://www.github.com/heyStranger/weather-app",
      date: "2024-05-01",
      bullets: [
        "Fetched real-time weather data using OpenWeatherMap API",
        "Used useEffect and useContext for state and API management",
        "Clean mobile-first UI built with Tailwind CSS",
      ],
    },
  ],
  softSkills: [
    { id: newId(), skill: "Teamwork" },
    { id: newId(), skill: "Communication" },
    { id: newId(), skill: "Problem-solving" },
    { id: newId(), skill: "Time management" },
    { id: newId(), skill: "Adaptability" },
  ],
};
