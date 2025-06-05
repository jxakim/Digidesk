import React, { useState } from 'react';
import '../styling/format.css';

function Filter({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value, category });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    onFilterChange({ search, category: value });
  };

  return (
    <div className="filter-container">
      <select value={category} onChange={handleCategoryChange}>
        <option value="">Alle kategorier</option>
        <option value="konto">Brukerkonto</option>
        <option value="datamaskin">Maskinvare</option>
        <option value="windows">Windows</option>
      </select>

      <input
        type="text"
        placeholder="Søk etter tittel..."
        value={search}
        onChange={handleSearchChange}
      />
    </div>
  );
}

export default Filter;
