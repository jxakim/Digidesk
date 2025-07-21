import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  const Navigate = useNavigate();

  useEffect(() => {
    fetch('/api/verify', { credentials: 'include' })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false); // User is not authenticated
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


            {isAuthenticated && (
              <a
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch('/api/logout', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                    });

                    if (res.ok) {
                      setIsAuthenticated(false);
                      Navigate('/');
                    } else {
                      console.error('Failed to log out');
                    }
                  } catch (err) {
                    console.error('Error during logout:', err);
                  }
                }}
              >
                Logg ut
              </a>
            )}
        </div>
    </div>
  );
}

export default Navbar;
