import React, { useState } from 'react';
import '../styling/format.css';
import '../styling/new-case.css';

function NewCase({ onCaseAdded }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Desc: '',
  });

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
        setFormData({ Name: '', Desc: '' });
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
          <h2>Lag en ny sak</h2>
          <label>
            Tittel
            <input
              type="text"
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
          <button type="submit" className="normal-button">Add Case</button>
        </form>
      </div>
    </>
  );
}

export default NewCase;