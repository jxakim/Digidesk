import React, { useState } from 'react';
import '../styling/format.css';

const predefinedPermissions = [
  'create-cases',
  'create-users',
  'create-groups',
  'edit-cases',
  'delete-cases',
  'bin-cases',
  'archive-cases',
];

function NewGroup({ isOpen, onToggle }) {
  const [formData, setFormData] = useState({
    Name: '',
  });
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const handleAddPermission = (permission) => {
    if (!selectedPermissions.includes(permission)) {
      setSelectedPermissions((prev) => [...prev, permission]);
    }
  };

  const handleRemovePermission = (permission) => {
    setSelectedPermissions((prev) => prev.filter((p) => p !== permission));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Permission') {
      if (value && !selectedPermissions.includes(value)) {
        setSelectedPermissions((prev) => [...prev, value]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting group data:', {
      ...formData,
      Permissions: selectedPermissions,
    });
    try {
      const response = await fetch('/api/groups/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, Permissions: selectedPermissions }),
      });

      if (response.ok) {
        setFormData({ Name: '' });
        setSelectedPermissions([]);
        onToggle();
        console.log('Group added successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to add group:', errorText);
      }
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  return (
    <>
      <button className="normal-button" onClick={onToggle}>
        Lag ny gruppe
      </button>

      {isOpen && (
        <div className="side-menu open">
          <form onSubmit={handleSubmit}>
            <div className="menu-header">
              <h2>Lag en ny gruppe</h2>
              <img onClick={onToggle} alt="Closing button" src="/close.png" />
            </div>

            <label>
              Navn
              <input
                type="text"
                maxLength={40}
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Tilganger
              <select
                name="Permission"
                value=""
                onChange={handleInputChange}
              >
                <option value="" disabled hidden>Velg en tilgang</option>
                {predefinedPermissions.map((permission) => (
                  <option
                    key={permission}
                    value={permission}
                    style={{
                      display: selectedPermissions.includes(permission)
                        ? 'none'
                        : 'block',
                    }}
                  >
                    {permission}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <h3>Valgte Tilganger:</h3>
              <ul>
                {selectedPermissions.map((item, index) => (
                  <li key={index}>
                    {item}{' '}
                    <button
                      type="button"
                      onClick={() => handleRemovePermission(item)}
                      style={{
                        marginLeft: '10px',
                        color: 'red',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                      }}
                    >
                      Fjern
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button type="submit" className="normal-button">
              Legg til gruppe
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default NewGroup;