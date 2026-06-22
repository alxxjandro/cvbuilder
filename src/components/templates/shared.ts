import type { Profile } from "../../types/cv";

/**
 * Joins the present (non-empty) parts of a list with a middot separator.
 *
 * @param parts - Candidate strings, some of which may be empty.
 * @returns The non-empty parts joined by `" · "`, or `""` when all are empty.
 */
export function joinPresent(parts: string[]): string {
  return parts.filter(Boolean).join(" · ");
}

/**
 * Builds the contact/header lines shown under a CV's name: email on its own
 * line, then phone/city, then the social links. Empty parts are dropped so a
 * sparse profile never renders blank rows.
 *
 * @param profile - The document's profile header.
 * @returns The non-empty contact lines, in display order.
 */
export function contactLines(profile: Profile): string[] {
  return [
    profile.email,
    joinPresent([profile.phoneNumber, profile.city]),
    joinPresent([profile.github, profile.linkedin, profile.portfolio]),
  ].filter(Boolean);
}

/**
 * Derives up-to-two-letter initials from a first/last name, used as the photo
 * placeholder when no headshot has been uploaded.
 *
 * @param firstName - The profile first name.
 * @param lastName - The profile last name.
 * @returns Uppercase initials, for example `"MO"`, or `""` when both are empty.
 */
export function initials(firstName: string, lastName: string): string {
  return [firstName, lastName]
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
