import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [ip, setIp] = useState("");
  const [startPort, setStartPort] = useState(1);
  const [endPort, setEndPort] = useState(1024);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const startScan = async () => {
    setLoading(true);
    setResults({});
    try {
      const response = await axios.post("http://localhost:5000/scan", {
        ip,
        start_port: startPort,
        end_port: endPort,
      });
      setResults(response.data);
    } catch (error) {
      alert("Scan failed. Make sure your backend is running.");
    }
    setLoading(false);
  };

  const detectMyIP = async () => {
    try {
      const response = await axios.get("http://localhost:5000/my-ip");
      setIp(response.data.ip);
    } catch (error) {
      alert("Could not detect your local IP address.");
    }
  };

  const detectPublicIP = async () => {
    try {
      const response = await axios.get("http://localhost:5000/public-ip");
      setIp(response.data.ip);
    } catch (error) {
      alert("Could not detect your public IP address.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Port Scanner</h1>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="IP Address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={detectMyIP} style={{ marginRight: "10px" }}>
          Detect My IP
        </button>
        <button onClick={detectPublicIP}>Detect Public IP</button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={startPort}
          onChange={(e) => {
            const value = e.target.value.replace(/^0+/, ""); // remove leading zeros
            setStartPort(value === "" ? "" : parseInt(value));
          }}
          placeholder="Start Port"
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          value={endPort}
          onChange={(e) => {
            const value = e.target.value.replace(/^0+/, ""); // remove leading zeros
            setEndPort(value === "" ? "" : parseInt(value));
          }}
          placeholder="End Port"
        />
      </div>
      <button onClick={startScan}>Start Scan</button>

      {loading && <p>Scanning...</p>}
      {Object.keys(results).length > 0 && (
        <div style={{ display: "flex", marginTop: "20px", gap: "40px" }}>
          <div>
            <h3>🟢 Open Ports</h3>
            <table>
              <thead>
                <tr>
                  <th>Port</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results)
                  .filter(([_, status]) => status === "open")
                  .map(([port]) => (
                    <tr key={port}>
                      <td>{port}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3>🔴 Closed Ports</h3>
            <table>
              <thead>
                <tr>
                  <th>Port</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results)
                  .filter(([_, status]) => status === "closed")
                  .map(([port]) => (
                    <tr key={port}>
                      <td>{port}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
