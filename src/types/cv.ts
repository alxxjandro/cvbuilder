/**
 * Central, typed data model for a CV. Every other layer (forms, preview,
 * reducer, future persistence and export) consumes these types as the single
 * source of truth.
 *
 * Convention: every entry that lives inside a list owns a stable `id` so that
 * React keys, edits, deletes and reordering never rely on array indices.
 */

/**
 * Contact and header information shown at the top of the CV.
 */
export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

/**
 * A single education entry (school, degree and dates).
 */
export interface Education {
  id: string;
  schoolName: string;
  degreeName: string;
  degreeCity: string;
  startDate: string;
  endDate: string;
  extraNotes: string;
}

/**
 * A named group of technical skills, for example "Programming Languages".
 */
export interface SkillGroup {
  id: string;
  groupName: string;
  groupValues: string[];
}

/**
 * A work experience entry. An ongoing role is modelled with `current: true`
 * instead of storing the literal string "Present" in `toDate`.
 */
export interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  fromDate: string;
  toDate: string;
  current: boolean;
  bullets: string[];
}

/**
 * A personal or professional project entry.
 */
export interface Project {
  id: string;
  projectName: string;
  link: string;
  date: string;
  bullets: string[];
}

/**
 * A single soft skill, for example "Teamwork".
 */
export interface SoftSkill {
  id: string;
  skill: string;
}

/**
 * The complete CV document.
 */
export interface CVData {
  profile: Profile;
  education: Education[];
  skillGroups: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  softSkills: SoftSkill[];
}

/**
 * Maps each list section key to the entry type it stores.
 */
export interface SectionEntryMap {
  education: Education;
  skillGroups: SkillGroup;
  experience: Experience;
  projects: Project;
  softSkills: SoftSkill;
}

/**
 * Keys of {@link CVData} that hold an array of entries.
 */
export type ListSection = keyof SectionEntryMap;

/**
 * List sections whose entries contain an editable array of string lines.
 */
export type BulletSection = "experience" | "projects" | "skillGroups";
