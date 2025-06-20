import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CaseCard from './cards/case-card';
import '../styling/cases.css';
import { Trash, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : window.location.origin;

// Connect to the WebSocket server
export const socket = io(baseUrl, {
  withCredentials: true,
});

function Cases({ Crop, Header, Config, Refresh, Status, Filter, ArchiveView, Trashed }) {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState({ search: '', status: '', category: '', subcategory: '' });
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [binLoading, setBinLoading] = useState(false);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch = filter.search === '' || c.Name.toLowerCase().includes(filter.search.toLowerCase());
      const matchesCategory = filter.category === '' || c.Category === filter.category;
      const matchesSubcategory = filter.subcategory === '' || c.Subcategory === filter.subcategory;
      const matchesStatus = filter.status === '' || (c.Status && c.Status.toLowerCase() === filter.status.toLowerCase());
      const matchesGlobalStatus = !Status || (c.Status && c.Status.toLowerCase() === Status.toLowerCase());
      const matchesArchiveView = ArchiveView ? c.Archived : !c.Archived;
      const matchesTrashed = Trashed ? c.Trashed : !c.Trashed;

      return [
        matchesSearch,
        matchesCategory,
        matchesSubcategory,
        matchesStatus,
        matchesGlobalStatus,
        matchesArchiveView,
        matchesTrashed,
      ].every(Boolean);
    });
  }, [cases, filter, Status, ArchiveView, Trashed]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch cases');
        const data = await res.json();
        setCases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching cases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();

    // Listen for real-time updates
    socket.on('caseUpdated', (updatedCase) => {
      setCases((prevCases) => {
        const exists = prevCases.some((c) => c._id === updatedCase._id);
        if (!exists) return prevCases;
        return prevCases.map((c) =>
          c._id === updatedCase._id ? updatedCase : c
        );
      });
    });

    socket.on('caseTrashed', (trashedCase) => {
      setCases((prevCases) => {
        const exists = prevCases.some((c) => c._id === trashedCase._id);
        if (!exists) return prevCases;

        return prevCases.map((c) =>
          c._id === trashedCase._id ? { ...c, Trashed: trashedCase.Trashed } : c
        );
      });
    });

    socket.on('caseDeleted', (deletedCase) => {
      setCases((prevCases) => {
        const exists = prevCases.some((c) => c._id === deletedCase._id);
        if (!exists) return prevCases;
    
        return prevCases.filter((c) => c._id !== deletedCase._id); 
      });
    });

    socket.on('caseCreated', (newCase) => {
      setCases((prevCases) => {
        const exists = prevCases.some((c) => c._id === newCase._id);
        if (exists) return prevCases;
    
        return [...prevCases, newCase];
      });
    });

    return () => {
      socket.off('caseUpdated');
    };

  }, []);
  
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch('/api/users/permissions', {
          credentials: 'include',
        });

        if (res.status === 401) {
          setPermissions([]);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch permissions');
        }

        const data = await res.json();
        setPermissions(data || []);
      } catch (err) {
        if (err.message !== 'Failed to fetch permissions') {
          console.warn('Error fetching permissions:', err.message);
        }
        setPermissions([]);
      } finally {
        setLoading(false)
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
    setBinLoading(true);
    try {
      const res = await fetch(`/api/cases/${id}/bin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        const updatedCase = await res.json();
        setCases((prevCases) =>
          prevCases.map((c) =>
            c._id === id ? updatedCase : c
          )
        );
      } else {
        const text = await res.text();
        console.error('Failed to bin case:', text);
      }
    } catch (err) {
      console.error('Error trashing case:', err);
    } finally {
      setBinLoading(false);
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

              {hasPermission('bin-cases') && !caseItem.Archived && (
                !(caseItem.Trashed) ? (
                  <button
                    className="warn-button"
                    onClick={() => handleBin(caseItem._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                ) : (
                  <button
                    className="attention-button"
                    onClick={() => handleBin(caseItem._id)}
                  >
                    <Trash size={16} />
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
