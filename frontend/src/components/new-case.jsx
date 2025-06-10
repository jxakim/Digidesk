import React, { useState } from 'react';
import '../styling/format.css';
import '../styling/new-case.css';

function NewCase({ onCaseAdded }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Desc: '',
    Status: 'recognized',
    Category: '',
    Subcategory: '',
  });

const categories = [
    'Konto',
    'Datamaskin',
    'Programvare'
];

const subcategories = {
    Konto: ['Passord', 'Brukertilgang', 'To-faktor'],
    Datamaskin: ['Skjerm', 'Tastatur', 'Nettverk'],
    Programvare: ['Oppdateringer', 'Feilmeldinger', "Office 365", 'Windows', 'Annen programvare'],
};

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cases/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ Name: '', Desc: '', Status: 'recognized', Category: '', Subcategory: '' });
        setMenuOpen(false);
        console.log('Case added successfully');
        if (onCaseAdded) onCaseAdded();
      } else {
        const errorText = await response.text();
        console.error('Failed to add case:', errorText);
      }
    } catch (error) {
      console.error('Error adding case:', error);
    }
  };

  return (
    <>
      <button className="normal-button" onClick={toggleMenu}>Lag ny sak</button>

      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <form onSubmit={handleSubmit}>
          <div className="menu-header">
            <h2>Lag en ny sak</h2>
            <img onClick={toggleMenu} alt='Closing button' src="/close.png" />
          </div>

          <label>
            Tittel
            <input
              type="text"
              maxLength={ 40 }
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Beskrivelse
            <textarea
              name="Desc"
              value={formData.Desc}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Status
            <select
              name="Status"
              value={formData.Status}
              onChange={handleInputChange}
              required
            >
              <option value="recognized">Recognized</option>
              <option value="in-progress">In-Progress</option>
              <option value="solved">Solved</option>
            </select>
          </label>

          <label>
            Hovedkategori
            <select
              name="Category"
              value={formData.Category}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled hidden>Velg kategori</option>
              {categories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
              ))}
            </select>
          </label>

          {formData.Category && (
            <label>
              Underkategori
              <select
                name="Subcategory"
                value={formData.Subcategory}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled hidden>Velg underkategori</option>
                {subcategories[formData.Category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </label>
          )}


          <button type="submit" className="normal-button">Add Case</button>
        </form>
      </div>
    </>
  );
}

export default NewCase;