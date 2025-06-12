import React, { useState, useEffect } from 'react';
import "../styling/format.css";
import Cases from '../components/cases';
import NewCase from '../components/new-case';
import NewUser from '../components/new-user';
// import Request from '../components/request';

function Admin() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

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
        <NewCase onCaseAdded={triggerRefresh} isOpen={openMenu === 'newCase'} onToggle={() => handleMenuToggle('newCase')}/>
        <NewUser isOpen={openMenu === 'newUser'} onToggle={() => handleMenuToggle('newUser')} />
      </div>

      <Cases Header="Konfigurering: Alle saker" Config={true} Refresh={refreshFlag} Filter ArchiveView/>
    </>
  );  
}   

export default Admin;
