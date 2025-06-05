import React, { useState, useEffect, useRef } from 'react';
import { redirect, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styling/cases.css';
import '../styling/case.css';
import "../styling/format.css";

function Case({ Viewmode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [caseItem, setCaseItem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Name: '',
    Desc: '',
    Status: 'recognized',
    Category: '',
    Subcategory: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      setLoading(true);

      const updatedFormData = {
        ...formData,
        Updated: new Date().toISOString(),
      };

      const response = await fetch(`/api/cases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        const updatedCase = await response.json();
        setCaseItem(updatedCase);
        setFormData({
          Name: updatedCase.Name,
          Desc: updatedCase.Desc,
          Status: updatedCase.Status,
          Category: updatedCase.Category,
          Subcategory: updatedCase.Subcategory,
          Updated: updatedCase.Updated,
        });
        navigate(`/admin/home`);
        setLoading(false);
      } else {
        const errorText = await response.text();
        navigate(`/admin/home`);
        console.error('Feil ved oppdatering av sak:', errorText);
        alert('Feil ved oppdatering av sak: ' + errorText);
        setLoading(false);
      }
    } catch (error) {
      navigate(`/admin/home`);
      console.error('Feil ved oppdatering av sak:', error);
      alert('En uventet feil oppstod: ' + error.message);
      setLoading(false);
    }
  };

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
        setFormData({
          Name: data.Name || '',
          Desc: data.Desc || '',
          Status: data.Status || 'recognized',
          Category: data.Category || '',
          Subcategory: data.Subcategory || '',
        });
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
    <>
      {Viewmode === "admin" ? (
        <div className="case-page">
          <form onSubmit={handleSubmit}>
            <div className="case-card">
              <input
                className="case-title-edit"
                maxLength={ 40 }
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
              />
              <p className="case-category">
                Kategori: {capitalizeFirst(formData.Category)} / {capitalizeFirst(formData.Subcategory)}
              </p>

              <textarea
                className="case-desc-edit"
                name="Desc"
                value={formData.Desc}
                onChange={handleInputChange}
              />
              <p className="case-small">
                Opprettet: {new Date(caseItem.Created).toLocaleString()}<br />
                Sist oppdatert: {new Date(caseItem.Updated).toLocaleString()}<br />
                <br />
                Status: {capitalizeFirst(formData.Status)}
              </p>
            </div>

            <div className="case-buttons">
              <button className="normal-button" type="submit">
                Lagre endringer
              </button>

              <button
                type="button"
                className="warn-button"
                onClick={() => {navigate(`/admin/home`)}}
              >
                Avbryt
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="case-page">
          <div className="case-card">
            <h1 className="case-title">{capitalizeFirst(caseItem.Name)}</h1>
            <p className="case-category">
              Kategori: {capitalizeFirst(caseItem.Category)} / {capitalizeFirst(caseItem.Subcategory)}
            </p>
            <div
              className="case-desc"
              dangerouslySetInnerHTML={{ __html: caseItem.Desc }}
            />
            <p className="case-small">
              Opprettet: {new Date(caseItem.Created).toLocaleString()}<br />
              Sist oppdatert: {new Date(caseItem.Updated).toLocaleString()}<br />
              <br />
              Status: {capitalizeFirst(caseItem.Status)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Case;
