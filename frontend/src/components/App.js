import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000')
      .then((res) => res.text())
      .then((data) => setMessage(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Greveskogen IT Infoside</h1>
        <p>Denne siden er en info side for IT-Servicedesken på Greveskogen VGS.</p>

        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
