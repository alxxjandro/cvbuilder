function CV({ data }) {
  return (
    <div className="CVcontainer">
      <div className="CV">
        <p>{data.profile.firstName}</p>
        <p>{data.profile.lastName}</p>
      </div>
    </div>
  );
}

export default CV;
