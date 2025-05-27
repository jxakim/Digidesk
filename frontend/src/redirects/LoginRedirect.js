import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../pages/Login';

const LoginRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/verify', {
      credentials: 'include',
    })
      .then(res => {
        setIsAuthenticated(res.ok);
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Navigate to="/admin/home" /> : <Login />;
};

export default LoginRedirect;
