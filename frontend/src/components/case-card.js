import { useEffect, useState } from 'react';

import '../styling/card.css';

function Card() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000')
      .then((res) => res.text())
      .then((data) => setMessage(data));
  }, []);

  return (
    <div class="card">
      <h3>Nett på mobil</h3>
      <p>Trenger du nett på mobil? Her kan du se hvordan du kobler deg til vårt nettverk på telefonen din.</p>
    </div>
  );
}

export default Card;
