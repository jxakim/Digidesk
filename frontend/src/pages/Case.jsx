import React, { useState, useEffect, useRef } from 'react';
import { redirect, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import '../styling/cases.css';
import '../styling/case.css';
import "../styling/format.css";

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : window.location.origin;

function Case({ Viewmode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [caseItem, setCaseItem] = useState(null);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Name: '',
    Desc: '',
    Status: 'recognized',
    Category: '',
    Subcategory: '',
    Content: '',
    Images: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageClick = (imagePath) => {
    if (imagePath) {
      setModalImage(imagePath);
    } else {
      console.error('Invalid image path:', imagePath);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file instanceof Blob) {
      const imageURL = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        Content: `${prev.Content}<img src="${imageURL}" alt="Uploaded Image" />`,
        Images: [...prev.Images, file],
      }));
    } else {
      console.error('Invalid file uploaded:', file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      setLoading(true);

      const updatedFormData = new FormData();
      updatedFormData.append('Name', formData.Name);
      updatedFormData.append('Desc', formData.Desc);
      updatedFormData.append('Status', formData.Status);
      updatedFormData.append('Category', formData.Category);
      updatedFormData.append('Subcategory', formData.Subcategory);
      updatedFormData.append('Updated', new Date().toISOString());
      formData.Images.forEach((image) => {
        if (typeof image === 'string') {
          updatedFormData.append('ExistingImages', image);
        } else if (image instanceof Blob) {
          updatedFormData.append('Images', image);
        }
      });

      const response = await fetch(`/api/cases/${id}`, {
        method: 'PUT',
        body: updatedFormData,
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
          Images: updatedCase.Images || [],
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

  const handleDeleteImage = async (index) => {
    const imageToDelete = formData.Images[index];

    if (typeof imageToDelete === 'string') {
      try {
        const response = await fetch(`/api/cases/images/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imagePath: imageToDelete }),
        });
  
        if (response.ok) {
          setFormData((prev) => {
            const updatedImages = [...prev.Images];
            updatedImages.splice(index, 1);
            return { ...prev, Images: updatedImages };
          });
        } else {
          console.error('Failed to delete image:', await response.text());
        }
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    } else {
      setFormData((prev) => {
        const updatedImages = [...prev.Images];
        updatedImages.splice(index, 1);
        return { ...prev, Images: updatedImages };
      });
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
          Content: data.Content || '',
          Images: data.Images || [],
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
      {modalImage && (
        <div className="image-modal" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Full Size" className="modal-image" />
        </div>
      )}

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

              <label>
                Last opp bilde
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>

              <div className="image-preview">
                {formData.Images.map((image, index) => {
                  let imagePath;

                  if (typeof image === 'string') {
                    imagePath = `${baseUrl}${image}`;
                  } else if (image instanceof Blob) {
                    imagePath = URL.createObjectURL(image);
                  } else {
                    // console.log('Invalid image in Images array:', image);
                    return null;
                  }

                  return (
                    <div key={index} className="image-container">
                      <img
                        src={imagePath}
                        alt={`Preview ${index}`}
                        className="image-thumbnail"
                        onClick={() => setModalImage(imagePath)}
                      />

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDeleteImage(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="delete-icon" >
                          <line x1="3" y1="3" x2="20" y2="20" stroke="white" strokeWidth="4" strokeLinecap="round" />
                          <line x1="20" y1="3" x2="3" y2="20" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

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

            <div className="image-preview">
              {caseItem.Images && caseItem.Images.map((image, index) => {
                const imagePath = typeof image === 'string' ? `${baseUrl}${image}` : null;
                if (!imagePath) {
                  return null;
                }

                return (
                  <img
                    key={index}
                    src={imagePath}
                    alt={`Case Image ${index}`}
                    className="image-thumbnail"
                    onClick={() => setModalImage(imagePath)}
                  />
                );
              })}
            </div>

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
