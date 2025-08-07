import { useState } from 'react';
import axios from 'axios';

function App() {
  const [ip, setIp] = useState('');
  const [startPort, setStartPort] = useState(1);
  const [endPort, setEndPort] = useState(1024);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const startScan = async () => {
    setLoading(true);
    setResults({});
    try {
      const response = await axios.post('http://localhost:5000/scan', {
        ip,
        start_port: startPort,
        end_port: endPort
      });
      setResults(response.data);
    } catch (error) {
      alert('Scan failed. Make sure your backend is running.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Port Scanner</h1>
      <input placeholder="IP Address" value={ip} onChange={e => setIp(e.target.value)} />
      <input type="number" value={startPort} onChange={e => setStartPort(Number(e.target.value))} />
      <input type="number" value={endPort} onChange={e => setEndPort(Number(e.target.value))} />
      <button onClick={startScan}>Start Scan</button>

      {loading && <p>Scanning...</p>}
      {Object.keys(results).length > 0 && (
        <table>
          <thead>
            <tr><th>Port</th><th>Status</th></tr>
          </thead>
          <tbody>
            {Object.entries(results).map(([port, status]) => (
              <tr key={port}><td>{port}</td><td>{status}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
