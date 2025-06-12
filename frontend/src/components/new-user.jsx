import React, { useState } from 'react';
import '../styling/format.css';

function NewUser({ isOpen, onToggle }) {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    Group: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ Username: '', Password: '', Group: '' });
        onToggle(); // Close the menu after successful submission
        console.log('User added successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to add user:', errorText);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <>
      <button className="normal-button" onClick={onToggle}>
        Lag ny bruker
      </button>

      {isOpen && (
        <div className="side-menu open">
          <form onSubmit={handleSubmit}>
            <div className="menu-header">
              <h2>Lag en ny bruker</h2>
              <img onClick={onToggle} alt="Closing button" src="/close.png" />
            </div>

            <label>
              Brukernavn
              <input
                type="text"
                maxLength={40}
                name="Username"
                value={formData.Username}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Passord
              <input
                type="text"
                maxLength={40}
                name="Password"
                value={formData.Password}
                onChange={handleInputChange}
                required
              />
            </label>

            <button type="submit" className="normal-button">
              Legg til bruker
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default NewUser;
