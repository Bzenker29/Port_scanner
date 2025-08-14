import { useState } from 'react';
import axios from 'axios';
import "./App.css";
import Footer from './elements/Footer';

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

  const detectMyIP = async () => {
    try {
      const response = await axios.get('http://localhost:5000/my-ip');
      setIp(response.data.ip);
    } catch (error) {
      alert('Could not detect your local IP address.');
    }
  };

  const detectPublicIP = async () => {
    try {
      const response = await axios.get('http://localhost:5000/public-ip');
      setIp(response.data.ip);
    } catch (error) {
      alert('Could not detect your public IP address.');
    }
  };

  return (
    <div className="main-container">
      <div className="main-content">
        <header className="main-header">
          <h1>Scan Ports</h1>
        </header>
        <section className="input-section">
          <input className="input-field" placeholder="IP Address" value={ip} onChange={e => setIp(e.target.value)} />
          <button className="scan-btn" onClick={detectMyIP}>Detect My IP</button>
          <button className="scan-btn" onClick={detectPublicIP}>Detect Public IP</button>
          <input className="input-field" type="number" value={startPort} onChange={e => setStartPort(Number(e.target.value))} placeholder="Start Port" />
          <input className="input-field" type="number" value={endPort} onChange={e => setEndPort(Number(e.target.value))} placeholder="End Port" />
          <button className="scan-btn" onClick={startScan}>Start Scan</button>
        </section>
        {loading && <div className="loading">Scanning...</div>}
        {Object.keys(results).length > 0 && (
          <section className="results-section">
            <h2>Scan Results</h2>
            <div className="results-boxes">
              <div className="results-box">
                <h3>Open Ports</h3>
                <div className="results-scroll">
                  <ul>
                    {Object.entries(results)
                      .filter(([_, status]) => status === 'open')
                      .map(([port]) => (
                        <li key={port}>{port}</li>
                      ))}
                  </ul>
                </div>
              </div>
              <div className="results-box">
                <h3>Closed Ports</h3>
                <div className="results-scroll">
                  <ul>
                    {Object.entries(results)
                      .filter(([_, status]) => status === 'closed')
                      .map(([port]) => (
                        <li key={port}>{port}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}
  <Footer />
      </div>
    </div>
  );
}

export default App;
