import React, { useState, useEffect } from 'react';
import LoginCard from '../components/cards/login-card';
import '../styling/cases.css';

function Login() {
  return (
    <div className="login-container">
      <h2 className="header">Administrator innlogging</h2>
      <div className="card-container">
        <LoginCard />
      </div>
    </div>
  );  
}

export default Login;
