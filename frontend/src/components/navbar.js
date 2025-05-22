import React from 'react';
import { useState, useEffect } from 'react';
import '../styling/navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="navbar">
        <div id="logo"><img src="vfk.png" alt="logo"/><a id="logo" href="/">Digital Servicedesk</a></div>

        <div id="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div id="navbar-right" className={menuOpen ? 'show' : ''}>
            <a href="/Problemer">Problemer</a>
            <a href="/Kontakt">Kontakt oss</a>
        </div>
    </div>
  );
}

export default Navbar;
