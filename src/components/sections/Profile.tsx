import type { Profile as ProfileData } from "../../types/cv";
import { useCVStore } from "../../state/cvStore";

/**
 * A single editable profile field. `multiline` renders a textarea instead of an
 * input.
 */
interface FieldDef {
  id: keyof ProfileData;
  label: string;
  type: string;
  multiline?: boolean;
}

const NAME_FIELDS: FieldDef[] = [
  { id: "firstName", label: "First Name", type: "text" },
  { id: "lastName", label: "Last Name", type: "text" },
];

const HEADLINE_FIELD: FieldDef = {
  id: "headline",
  label: "Headline",
  type: "text",
};

const SUMMARY_FIELD: FieldDef = {
  id: "summary",
  label: "Summary",
  type: "text",
  multiline: true,
};

const CONTACT_FIELDS: FieldDef[] = [
  { id: "email", label: "Email", type: "email" },
  { id: "phoneNumber", label: "Phone", type: "tel" },
  { id: "city", label: "City", type: "text" },
];

const SOCIAL_FIELDS: FieldDef[] = [
  { id: "linkedin", label: "LinkedIn Profile", type: "text" },
  { id: "github", label: "GitHub/GitLab", type: "text" },
  { id: "portfolio", label: "Portfolio", type: "text" },
];

/**
 * Editor for the CV header: name, contact details and social links.
 */
function Profile() {
  const profile = useCVStore((state) => state.data.profile);
  const updateProfileField = useCVStore((state) => state.updateProfileField);

  const renderField = ({ id, label, type, multiline }: FieldDef) => (
    <div key={id}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={profile[id]}
          onChange={(e) => updateProfileField(id, e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={profile[id]}
          onChange={(e) => updateProfileField(id, e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div className="profile">
      <div className="names">{NAME_FIELDS.map(renderField)}</div>
      <div className="headline">{renderField(HEADLINE_FIELD)}</div>
      <div className="summary">{renderField(SUMMARY_FIELD)}</div>
      <div className="contactInfo">{CONTACT_FIELDS.map(renderField)}</div>
      <div className="socials">{SOCIAL_FIELDS.map(renderField)}</div>
    </div>
  );
}

export default Profile;
