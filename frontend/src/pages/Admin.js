import React, { useState, useEffect } from 'react';
import "../styling/format.css";
import Cases from '../components/cases';
import NewCase from '../components/new-case';
// import Request from '../components/request';

function Admin() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev);
  };

  return (
    <>
      <div className="container">
        <h1>Administrering</h1>
        <NewCase onCaseAdded={triggerRefresh}/>
      </div>

      <Cases Header="Konfigurering: Alle saker" Config={true} Refresh={refreshFlag}/>
    </>
  );  
}   

export default Admin;
