import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CaseCard from './cards/case-card';
import '../styling/cases.css';

function Cases(props) {

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

  // Chosen by props
  const displayedCases = props.Crop
  ? cases.slice(0, typeof props.Crop.amount === 'number' ? props.Crop.amount : 3)
  : cases;

  return (
    <div className="cases-container">
      <h2 className="header">{props.Header}</h2>
      <div className="card-container">
        {
            props.Config ?
                displayedCases.map((caseItem) => (
                <div>
                    <Link to={`/cases/${caseItem._id}`} key={caseItem._id} className="card-link">
                        <CaseCard
                        key={caseItem._id}
                        Name={caseItem.Name}
                        Desc={caseItem.Desc}
                        />
                    </Link>

                    <button className="delete-button" onClick={async () => {
                        try {
                            const response = await fetch(`/api/cases/${caseItem._id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                            });

                            if (response.ok) {
                                setCases(cases.filter(c => c._id !== caseItem._id));
                            } else {
                                const errorText = await response.text();
                                console.error('Failed to delete case:', errorText);
                            }
                        } catch (error) {
                            console.error('Error deleting case:', error);
                        }
                    }}>Slett sak</button>
                </div>

                ))
            :
                displayedCases.map((caseItem) => (
                    <Link to={`/cases/${caseItem._id}`} key={caseItem._id} className="card-link">
                    <CaseCard
                        key={caseItem._id}
                        Name={caseItem.Name}
                        Desc={caseItem.Desc}
                    />
                    </Link>
                ))
        }
      </div>
    </div>
  );  
}

export default Cases;
