import { useState } from "react";

function CV({ data, view }) {
  
  return (
    <div className="CVcontainer">
      {view ? (
        <div className="CV">
          <p>{data.profile.firstName}</p>
          <p>{data.profile.lastName}</p>
          <p>{data.profile.email}</p>
          <p>{data.profile.phoneNumber}</p>
          <p>{data.profile.city}</p>
          <p>{data.profile.linkedin}</p>
          <p>{data.profile.github}</p>
          <p>{data.profile.portfolio}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default CV;
