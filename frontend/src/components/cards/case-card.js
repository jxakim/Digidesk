import '../../styling/case-card.css';

function Card(props) {
  console.log(props.Created, props.Status);
  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="card">
      <h3>{capitalizeFirst(props.Name)}</h3>
      <p>{capitalizeFirst(props.Desc)}</p>
      <br />
      <p className="card-status">Status: {capitalizeFirst(props.Status)}</p>
      <p className="card-date">Sist oppdatert: {new Date(props.Created).toLocaleDateString("no-NO")}</p>
    </div>
  );
}

export default Card;
