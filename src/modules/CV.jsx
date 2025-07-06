import { useState } from "react";

function CV({ data, view }) {
  
  const toggleView = () => {
    return setView(!view);
  };

  return (
    <div className="CVcontainer">
      {/* <button onClick={toggleView}>
        {view ? <FaEyeSlash /> : <FaEye />}{" "}
      </button> */}
      {view ? (
        <div className="CV">
          <p>{data.profile.firstName}</p>
          <p>{data.profile.lastName}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default CV;
