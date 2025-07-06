import { useEffect } from "react";
import "../../styles/Profile.css";

function Profile({ data, setData }) {

  const handleSetter = (e) => {
    let id = e.target.id;
    let newValue = e.target.value;
    console.log(id, newValue);
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [id]: newValue,
      },
    }));
  };

  return (
    <div className="profile">
      <div className="names">
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          value={data.profile.firstName}
          onChange={(e) => handleSetter(e)}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          value={data.profile.lastName}
          onChange={(e) => handleSetter(e)}
        />
      </div>

      <div className="contactInfo">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />

        <label htmlFor="phoneNumber">Phone</label>
        <input id="phoneNumber" type="tel" />

        <label htmlFor="city">City</label>
        <input id="city" type="text" />
      </div>

      <div className="socials">
        <label htmlFor="linkeding">LinkedIn Profile</label>
        <input id="linkeding" type="text" />

        <label htmlFor="gitHub">GitHub/GitLab</label>
        <input id="gitHub" type="text" />

        <label htmlFor="portfolio">Portfolio</label>
        <input id="portfolio" type="text" />
      </div>
    </div>
  );
}

export default Profile;
