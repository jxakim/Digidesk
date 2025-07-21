import React, { useState, useEffect } from 'react';
import "../styling/format.css";
import Usrs from '../components/users';
// import Request from '../components/request';

function Users() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetch('/api/users/permissions', {
        credentials: 'include',
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed to fetch permissions');
          }
        })
        .then(data => {
          setPermissions(data);
        })
        .catch(() => {
          setPermissions([]);
        })
        .finally(() => setLoading(false));
  }, []);
    
  if (loading) {
    return <p>Loading...</p>;
  }

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const handleMenuToggle = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev);
  };

  return (
    <>
        <div className="container">
            <h1>Brukere</h1>
        </div>
    </>
  );  
}   

export default Users;
