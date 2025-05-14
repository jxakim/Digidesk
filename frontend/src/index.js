import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Navbar from './components/navbar';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Home!
root.render(
  <React.StrictMode>
    <Navbar />
  </React.StrictMode>
);


reportWebVitals();
