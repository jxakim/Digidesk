import React, { useState, useEffect } from 'react';
import CaseCard from './cards/case-card';
import '../styling/cases.css';

function Cases() {

  const [cases, setCases] = useState([]);
  useEffect(() => {
    fetch('/api/cases')
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
      <h2 className="header">Kjente hendvendelser</h2>
      <div className="card-container">
        { 
          cases.map((caseItem) => (
            <CaseCard
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

export default Cases;
