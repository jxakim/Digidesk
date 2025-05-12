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
        <h1>This is a test</h1>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
