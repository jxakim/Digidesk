import React from 'react';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import '../styling/navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/verify', {
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div id="navbar">
        <div id="logo"><img src="/vfk.png" alt="logo"/><a id="logo" href="/">Digital Servicedesk</a></div>

        <div id="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div id="navbar-right" className={menuOpen ? 'show' : ''}>
            <a href="/Problemer">Problemer</a>
            <a href="/Kontakt">Kontakt oss</a>
            {isAuthenticated && <a href="/admin">Admin</a>}
        </div>
    </div>
  );
}

export default Navbar;
