import '../../styling/login-card.css';
import React, { useState } from 'react';

function LoginCard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      alert('Logged in!');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="test">
      <div className="login-card">
          <h3>Logg inn</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Brukernavn" value={username} onChange={e => setUsername(e.target.value)} required />
            <input type="password" placeholder="Passord" value={password} onChange={e => setPassword(e.target.value)}  required />
            <button type="submit">Logg inn</button>
          </form>
      </div>
    </div>
  );
}

export default LoginCard;
