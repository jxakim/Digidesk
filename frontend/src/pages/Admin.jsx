import React, { useState, useEffect } from 'react';
import "../styling/format.css";
import Cases from '../components/cases';
import NewCase from '../components/buttons/new-case';
import NewUser from '../components/buttons/new-user';
import NewGroup from '../components/buttons/new-group';
import NewButton from '../components/buttons/new-button';
// import Request from '../components/request';

function Admin() {
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
        <h1>Administrering</h1>
        {hasPermission('create-cases') && (
          <NewCase onCaseAdded={triggerRefresh} isOpen={openMenu === 'newCase'} onToggle={() => handleMenuToggle('newCase')}/>
        )}

        {hasPermission('create-users') && (
          <NewUser isOpen={openMenu === 'newUser'} onToggle={() => handleMenuToggle('newUser')} />
        )}

        {hasPermission('create-groups') && (
          <NewGroup isOpen={openMenu === 'newGroup'} onToggle={() => handleMenuToggle('newGroup')} />
        )}

        <br/>
        
        {hasPermission('view-users') && (
          <NewButton header="Se alle brukere" color="grey" redirect="/admin/users" />
        )}

        {hasPermission('view-groups') && (
          <NewButton header="Se alle grupper" color="grey" redirect="/admin/groups" />
        )}
      </div>

      <Cases Header="Alle saker" Config={true} Refresh={refreshFlag} Filter/>
      
      {hasPermission('view-archived') && (
        <Cases Header="Arkiverte saker" ArchiveView={true} Config={true} Refresh={refreshFlag} />
      )}

      {hasPermission('view-trashed') && (
        <Cases Header="Søppelkurv" Trashed={true} Config={true} Refresh={refreshFlag} />
      )}
    </>
  );
}

export default Admin;
