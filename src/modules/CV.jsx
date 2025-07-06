import { useState } from "react";

function CV({ data, view }) {
  return (
    <div className="CVcontainer">
      {view ? (
        <div className="CV">
          <div className="profile">
            <p>{data.profile.firstName}</p>
            <p>{data.profile.lastName}</p>
            <p>{data.profile.email}</p>
            <p>{data.profile.phoneNumber}</p>
            <p>{data.profile.city}</p>
            <p>{data.profile.linkedin}</p>
            <p>{data.profile.github}</p>
            <p>{data.profile.portfolio}</p>
          </div>
          <div>
            {data.education.map((e) => (
              <div id={e.id} key={e.id}>
                <p>{e.schoolName}</p>
                <p>{e.degreeName}</p>
                <p>{e.degreeCity}</p>
                <p>{e.startDate}</p>
                <p>{e.endDate}</p>
                <p>{e.extraNotes}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default CV;
