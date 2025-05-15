import React from 'react';
import '../styling/navbar.css';

function Navbar() {
  return (
    <div id="navbar">
        <div id="logo"><img src="vfk.png" alt="logo"/><span>Digital Servicedesk</span></div>

        <div id="navbar-right">
            <a href="#">Problemer</a>
            <a href="#">Åpningstider</a>
            <a href="#">Kontakt oss</a>
        </div>
    </div>
  );
}

export default Navbar;
