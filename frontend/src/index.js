import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Navbar from './components/navbar';
import Case from './components/cases';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Home!
root.render(
  <React.StrictMode>
    <Navbar />
    <Case />
  </React.StrictMode>
);


reportWebVitals();
