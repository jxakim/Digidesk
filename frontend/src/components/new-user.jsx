import React, { useState, useEffect } from 'react';
import '../styling/format.css';

function NewUser({ isOpen, onToggle }) {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    Group: 'Default',
  });
  const [groups, setGroups] = useState([]); // State to store available groups

  // Fetch groups from the backend when the component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups'); // Adjust the endpoint as needed
        if (response.ok) {
          const data = await response.json();
          setGroups(data); // Set the fetched groups in state
        } else {
          console.error('Failed to fetch groups:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []); // Empty dependency array ensures this runs only once

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
        onToggle();
        console.log('User added successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to add user:', errorText);
      }
    } catch (error) {
      console.alert('Error adding user:', error);
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
                type="password"
                maxLength={40}
                name="Password"
                value={formData.Password}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Gruppe
              <select
                name="Group"
                value={formData.Group}
                onChange={handleInputChange}
                required
              >
                <option value="">Velg en gruppe</option>
                {groups.map((group) => (
                  <option key={group._id} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>
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