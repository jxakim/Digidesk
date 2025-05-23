import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styling/cases.css';

function Case() {
  const { id } = useParams();
  const [caseItem, setCaseItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="case-container">
      <h1>{caseItem.Name}</h1>
      <p>{caseItem.Desc}</p>
    </div>
  );  
}

export default Case;
