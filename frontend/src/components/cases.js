import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CaseCard from './cards/case-card';
import '../styling/cases.css';

function Cases({ Crop, Header, Config, Refresh, Status }) {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetch('/api/cases')
      .then((res) => res.json())
      .then(setCases)
      .catch((err) => console.error('Error fetching cases:', err));
  }, [Refresh]);

  const filteredCases = Status
    ? cases.filter((c) => c.Status === Status)
    : cases;


  const displayedCases = Crop
    ? filteredCases.slice(0, Crop.amount ?? 3)
    : filteredCases;

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`/api/cases/edit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to edit case:', text);
      } else {
        console.log('yippe');
      }
    } catch (err) {
      console.error('Error editing case:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/cases/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        setCases((prev) => prev.filter((c) => c._id !== id));
      } else {
        const text = await res.text();
        console.error('Failed to delete case:', text);
      }
    } catch (err) {
      console.error('Error deleting case:', err);
    }
  };

  return (
    <div className="cases-container">
      <h2 className="header">{Header}</h2>
      <div className="card-container">
        {displayedCases.length === 0 ? (
          <div className="empty-message">
            <p>Ingen saker funnet..</p>
          </div>
        ) : (
          displayedCases.map((caseItem) => (
            <div key={caseItem._id} className="card-wrapper">
              <Link to={`/cases/${caseItem._id}`} className="card-link">
                <CaseCard {...caseItem} />
              </Link>

              {Config && (
                <div className="button-container">
                  <button
                    className="attention-button"
                    onClick={() => handleEdit(caseItem._id)}
                  >
                    Rediger sak
                  </button>
                  <button
                    className="warn-button"
                    onClick={() => handleDelete(caseItem._id)}
                  >
                    Slett sak
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Cases;
