import React, { useState, useEffect } from 'react';
import Card from './case-card';
import '../styling/cases.css';

function Case() {

  const [cases, setCases] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/cases')
      .then(response => response.json())
      .then(data => {
        setCases(data);
      })
      .catch(error => {
        console.error('Error fetching cases:', error);
      });
  }, []);  

  return (
    <div className="cases-container">
      <h2 className="header">Kjente henvendelser</h2>
      <div className="card-container">
        { 
          cases.map((caseItem) => (
            <Card
              key={caseItem._id}
              Name={caseItem.Name}
              Desc={caseItem.Desc}
            />
          ))
        }
      </div>
    </div>
  );  
}

export default Case;
