import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styling/cases.css';
import '../styling/case.css';
import "../styling/format.css";

function Case() {
  const { id } = useParams();
  const [caseItem, setCaseItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    fetch(`/api/cases/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Case not found');
        return res.json();
      })
      .then(data => {
        setCaseItem(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Laster...</div>;
  if (error) return <div>Feil: {error}</div>;

  return (
    <div className="case-page">
      <div className="case-card">
        <h1 className="case-title">{capitalizeFirst(caseItem.Name)}</h1>
        <div className="case-desc" dangerouslySetInnerHTML={{ __html: caseItem.Desc }} />
        <p className="case-dates">
          Opprettet: {new Date(caseItem.Created).toLocaleString()}<br />
          Sist oppdatert: {new Date(caseItem.Updated).toLocaleString()}<br />
          <br />
          Status: {capitalizeFirst(caseItem.Status)}
        </p>
      </div>
    </div>
  );
  
}

export default Case;
