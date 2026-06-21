import type { Profile as ProfileData } from "../../types/cv";
import { useCVStore } from "../../state/cvStore";

/**
 * A single editable profile field.
 */
interface FieldDef {
  id: keyof ProfileData;
  label: string;
  type: string;
}

const NAME_FIELDS: FieldDef[] = [
  { id: "firstName", label: "First Name", type: "text" },
  { id: "lastName", label: "Last Name", type: "text" },
];

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

  const renderField = ({ id, label, type }: FieldDef) => (
    <div key={id}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={profile[id]}
        onChange={(e) => updateProfileField(id, e.target.value)}
      />
    </div>
  );

  return (
    <div className="profile">
      <div className="names">{NAME_FIELDS.map(renderField)}</div>
      <div className="contactInfo">{CONTACT_FIELDS.map(renderField)}</div>
      <div className="socials">{SOCIAL_FIELDS.map(renderField)}</div>
    </div>
  );
}

export default Profile;
