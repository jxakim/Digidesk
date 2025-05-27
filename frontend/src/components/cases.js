import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CaseCard from './cards/case-card';
import '../styling/cases.css';

function Cases({ Crop, Header, Config, Refresh }) {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetch('/api/cases')
      .then((response) => response.json())
      .then((data) => setCases(data))
      .catch((error) => console.error('Error fetching cases:', error));
  }, [Refresh]);

  // Chosen by props
  const displayedCases = Crop
    ? cases.slice(0, typeof Crop.amount === 'number' ? Crop.amount : 3)
    : cases;

  const CasesEmpty = displayedCases.length === 0;

  return (
    <div className="cases-container">
      <h2 className="header">{Header}</h2>
      <div className="card-container">

        {CasesEmpty ? (
          <div className="empty-message">
            <p>Ingen saker funnet..</p>
          </div>
        ) : (
          Config ? displayedCases.map((caseItem) => (
                <div key={caseItem._id} className="card-wrapper">
                  <Link to={`/cases/${caseItem._id}`} className="card-link">
                    <CaseCard Name={caseItem.Name} Desc={caseItem.Desc} />
                  </Link>

                  <div className="button-container">
                    <button
                      className="attention-button"
                      onClick={async () => {
                          try {
                            const response = await fetch(`/api/cases/edit/${caseItem._id}`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                              },
                            });
  
                            if (response.ok) {
                              console.log("yippe");
                            } else {
                              const errorText = await response.text();
                              console.error('Failed to edit case:', errorText);
                            }
                          } catch (error) {
                            console.error('Error editing case:', error);
                          }
                      }}>Rediger sak</button>

                    <button
                      className="warn-button"
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/cases/${caseItem._id}`, {
                            method: 'DELETE',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                          });

                          if (response.ok) {
                            setCases(cases.filter((c) => c._id !== caseItem._id));
                          } else {
                            const errorText = await response.text();
                            console.error('Failed to delete case:', errorText);
                          }
                        } catch (error) {
                          console.error('Error deleting case:', error);
                        }
                      }}
                    >
                      Slett sak
                    </button>
                  </div>
                </div>
              ))
            : displayedCases.map((caseItem) => (
                <Link to={`/cases/${caseItem._id}`} key={caseItem._id} className="card-link">
                  <CaseCard Name={caseItem.Name} Desc={caseItem.Desc} />
                </Link>
              ))
        )}
      </div>
    </div>
  );
}

export default Cases;