import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';
import Navbar from './components/navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Kontakt from './pages/Kontakt';
import Problemer from './pages/Problemer';
import Case from './pages/Case';
import Admin from './pages/Admin';
import Users from './pages/Users';

import ProtectedRoute from './redirects/ProtectedRoute';
import LoginRedirect from './redirects/LoginRedirect';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<LoginRedirect />} />

        <Route
          path="/admin/home"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cases/edit/:id"
          element={
            <ProtectedRoute>
              <Case Viewmode="admin" />
            </ProtectedRoute>
          }
        />

        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/problemer" element={<Problemer />} />
        <Route path="/cases/:id" element={<Case />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
