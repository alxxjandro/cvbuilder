import { useRef, useState } from "react";
import type { Profile as ProfileData } from "../../types/cv";
import { useCVStore } from "../../state/cvStore";
import { resizeImageToDataUrl } from "../../lib/image";
import { initials } from "../templates/shared";

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
 * Headshot uploader shown for photo-bearing templates. The chosen image is
 * downscaled in the browser and stored inline as a base64 data URL.
 */
function PhotoField() {
  const profile = useCVStore((state) => state.data.profile);
  const updateProfileField = useCVStore((state) => state.updateProfileField);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      updateProfileField("photo", dataUrl);
      setError("");
    } catch {
      setError("Could not read that image. Try a JPG or PNG.");
    }
  };

  return (
    <div className="photo-field">
      <label>Photo</label>
      <div className="photo-field-row">
        <div className="photo-field-preview">
          {profile.photo ? (
            <img src={profile.photo} alt="" />
          ) : (
            <span>{initials(profile.firstName, profile.lastName) || "?"}</span>
          )}
        </div>
        <div className="photo-field-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => inputRef.current?.click()}
          >
            {profile.photo ? "Replace" : "Upload"}
          </button>
          {profile.photo && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => updateProfileField("photo", "")}
            >
              Remove
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
        </div>
      </div>
      {error && <p className="photo-field-error">{error}</p>}
    </div>
  );
}

/**
 * Editor for the CV header: name, contact details and social links.
 */
function Profile() {
  const profile = useCVStore((state) => state.data.profile);
  const templateId = useCVStore((state) => state.data.templateId);
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
      {templateId === "portrait" && <PhotoField />}
      <div className="names">{NAME_FIELDS.map(renderField)}</div>
      <div className="headline">{renderField(HEADLINE_FIELD)}</div>
      <div className="summary">{renderField(SUMMARY_FIELD)}</div>
      <div className="contactInfo">{CONTACT_FIELDS.map(renderField)}</div>
      <div className="socials">{SOCIAL_FIELDS.map(renderField)}</div>
    </div>
  );
}

export default Profile;
