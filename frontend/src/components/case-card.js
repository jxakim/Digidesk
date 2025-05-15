import { useEffect, useState } from 'react';

import '../styling/card.css';

function Card(props) {

  return (
    <div className="card">
      <h3>{props.Name}</h3>
      <p>{props.Desc}</p>
    </div>
  );
}

export default Card;
