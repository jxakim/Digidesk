import React from 'react';
import '../../styling/format.css';

function newButton({ header, color, redirect, size }) {
  const handleClick = () => {
    if (redirect) {
      window.location.href = redirect;
    }
  };

  return (
    <button
      className={`normal-button ${size}`}
      style={{ backgroundColor: color }}
      onClick={handleClick}
    >
      {header}
    </button>
  );
}

export default newButton;