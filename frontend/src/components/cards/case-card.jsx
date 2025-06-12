import '../../styling/case-card.css';

function Card(props) {
  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className={`card`}>
      {props.Archived && <h2 className="archivedTitle">ARKIVERT</h2>}
      <h3>{capitalizeFirst(props.Name)}</h3>
      <p>{capitalizeFirst(props.Desc)}</p>
      <br />
      <p className="card-status">Status: {capitalizeFirst(props.Status)}</p>
      <p className="card-date">Sist oppdatert: {new Date(props.Updated).toLocaleDateString("no-NO")}</p>
      {props.Category && <p className="card-category">Kategori: {capitalizeFirst(props.Category)}</p>}
    </div>
  );
}

export default Card;
