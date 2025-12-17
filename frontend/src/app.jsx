import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; 

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function App() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // ฟังก์ชันสำหรับเรียก API
    const fetchHealth = async () => {
      try {
        setStatus('Connecting to Backend...');
        
        // สมมติว่า Backend มี Endpoint /api/health
        const response = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 5000 }); 
        
        setData(response.data);
        setStatus('Connection Successful!');
        setError(null);

      } catch (err) {
        console.error("API Fetch Error:", err);
        setError(`Failed to connect to backend at ${BACKEND_URL}. Check Docker Compose/Backend Service.`);
        setStatus('Connection Failed!');
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="container">
      <h1>INT531 SRE Dashboard</h1>
      <p>Frontend attempting to communicate with Backend Service.</p>

      <div className={`status-box ${error ? 'error' : data ? 'success' : 'loading'}`}>
        <h2>Status: {status}</h2>
        {error && <p className="error-message">Error: {error}</p>}
      </div>

      {data && (
        <div className="data-box">
          <h3>Backend Data Received:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      
      <p className="note">Note: The Backend must be running on 'backend:8080' within the Docker network.</p>
    </div>
  );
}

export default App;