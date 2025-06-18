import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CaseCard from './cards/case-card';
import '../styling/cases.css';
import { Trash2 } from 'lucide-react';

function Cases({ Crop, Header, Config, Refresh, Status, Filter, ArchiveView, Trashed }) {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState({ search: '', status: '', category: '', subcategory: '' });
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases', { credentials: 'include' });
        if (res.status === 401) {
          console.error('User is not authenticated');
          return;
        }
        if (!res.ok) {
          console.error('Failed to fetch cases:', res.statusText);
          setCases([]);
          return;
        }
        const data = await res.json();
        setCases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setCases([]);
      }
    };

    fetchCases();

    const interval = setInterval(fetchCases, 60000);
    return () => clearInterval(interval);
  }, [Refresh]);
  
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch('/api/users/permissions', {
          credentials: 'include',
        });

        if (res.status === 401) {
          // User is not authenticated, handle gracefully
          setPermissions([]); // Clear permissions
          setLoading(false); // Stop loading
          return; // Stop further processing
        }

        if (!res.ok) {
          throw new Error('Failed to fetch permissions');
        }

        const data = await res.json();
        setPermissions(data || []); // Set permissions if data exists
      } catch (err) {
        if (err.message !== 'Failed to fetch permissions') {
          // Suppress logging for expected errors
          console.warn('Error fetching permissions:', err.message);
        }
        setPermissions([]); // Clear permissions on error
      } finally {
        setLoading(false); // Ensure loading is stopped
      }
    };

    fetchPermissions();
  }, []);
  
  if (loading) {
    return <p>Loading...</p>;
  }

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && { subcategory: '' }),
    }));
  };

  const filteredCases = Array.isArray(cases)
    ? cases.filter((c) => {
        const matchesSearch =
          filter.search === '' ||
          c.Name.toLowerCase().includes(filter.search.toLowerCase());

        const matchesCategory =
          filter.category === '' || c.Category === filter.category;

        const matchesSubcategory =
          filter.subcategory === '' || c.Subcategory === filter.subcategory;

        const matchesStatus =
          (filter.status === '' || (c.Status && c.Status.toLowerCase() === filter.status.toLowerCase())) &&
          (!Status || (c.Status && c.Status.toLowerCase() === Status.toLowerCase()));

        const matchesArchived =
          (ArchiveView ? c.Archived : !c.Archived);

        const matchesTrashed =
          (Trashed ? c.Trashed : !c.Trashed);

        return matchesSearch && matchesCategory && matchesSubcategory && matchesStatus && matchesArchived && matchesTrashed;
      })
    : [];

  const displayedCases = Crop
    ? filteredCases.slice(0, Crop.amount ?? 3)
    : filteredCases;

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/cases/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        setCases((prev) => prev.filter((c) => c._id !== id));
      } else {
        const text = await res.text();
        console.error('Failed to delete case:', text);
      }
    } catch (err) {
      console.error('Error deleting case:', err);
    }
  };

  const handleBin = async (id) => {
    try {
      const res = await fetch(`/api/cases/${id}/bin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        setCases((prev) => prev.filter((c) => c._id !== id));
      } else {
        const text = await res.text();
        console.error('Failed to bin case:', text);
      }
    } catch (err) {
      console.error('Error trashing case:', err);
    }
  };

  return (
    <div className="cases-container">
      <h2 className="header">{Header}</h2>

      {Filter && (
        <div className="filter-container">
          <input type="text" name="search" placeholder="Søk etter et problem..." value={filter.search} onChange={handleFilterChange} className="filter-input" />
          
          <select name="status" value={filter.status} onChange={handleFilterChange} className="filter-select" >
            <option value="">All status</option>
            {[...new Set(cases.map((c) => c.Status))].map((status) => (
              <option key={status} value={status}>
                {capitalizeFirst(status)}
              </option>
            ))}
          </select>

          <select name="category" value={filter.category} onChange={handleFilterChange} className="filter-select" >
            <option value="">Alle kategorier</option>
            {[...new Set(cases.map((c) => c.Category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {filter.category && (
            <select name="subcategory" value={filter.subcategory || ''} onChange={handleFilterChange} className="filter-select" >
              <option value="">Alle underkategorier</option>
              {[...new Set(cases.filter((c) => c.Category === filter.category)
                  .map((c) => c.Subcategory)
                    )].map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
              ))}
            </select>
          )}
        </div>
      )}

      <br />

      <div className="card-container">
        {displayedCases.length === 0 ? (
          <div className="empty-message">
            <p>Ingen saker funnet..</p>
          </div>
        ) : (
          displayedCases.map((caseItem) => (
            <div key={caseItem._id} className="card-wrapper">
              <Link to={`/cases/${caseItem._id}`} className="card-link">
                <CaseCard {...caseItem} />
              </Link>

              {Config && (
                <div className="button-container">
                  {hasPermission('edit-cases') && !(caseItem.Trashed) && (
                    <Link to={`/cases/edit/${caseItem._id}`} className="card-link">
                      <button className="attention-button">
                        Rediger sak
                      </button>
                    </Link>
                  )}

                  {hasPermission('bin-cases') && (
                    !(caseItem.Trashed) ? (
                      <button
                        className="warn-button"
                        onClick={() => handleBin(caseItem._id)}
                      >
                        <Trash2 size={16} fill="currentColor" color="white" />
                      </button>
                    ) : (
                      <button
                        className="attention-button"
                        onClick={() => handleBin(caseItem._id)}
                      >
                        Fjern fra søppelkurv
                      </button>
                    )
                  )}

                  {hasPermission('delete-cases') && (
                    <button
                      className="warn-button"
                      onClick={() => handleDelete(caseItem._id)}
                    >
                      Slett sak
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 

export default Cases;
