import React from 'react';
import '../styling/navbar.css';

function Navbar() {
  return (
    <div id="navbar">
        <a href="/" id="logo">Navbar</a>

        <div id="navbar-right">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Store</a>
            <a href="#">Contact</a>
        </div>
    </div>
  );
}

export default Navbar;
