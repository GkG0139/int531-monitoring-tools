import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; 

const BACKEND_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [texts, setTexts] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all texts on component mount
  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BACKEND_URL}/texts`);
      setTexts(response.data);
    } catch (err) {
      console.error("Failed to fetch texts:", err);
      setError('Failed to load messages. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setError(null);
      await axios.put(`${BACKEND_URL}/texts`, newMessage, {
        headers: { 'Content-Type': 'text/plain' }
      });
      setNewMessage('');
      setSuccessMessage('✓ Message created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchTexts();
    } catch (err) {
      console.error("Failed to create text:", err);
      setError('Failed to create message.');
    }
  };

  const handleUpdate = (id) => {
    alert(`⚠️ Update functionality not yet implemented in backend.\n\nMessage ID: ${id}\n\nThis feature requires backend to support UPDATE endpoint.`);
  };

  const handleDelete = (id) => {
    alert(`⚠️ Delete functionality not yet implemented in backend.\n\nMessage ID: ${id}\n\nThis feature requires backend to support DELETE endpoint.`);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📝 Text Message Manager</h1>
          <p className="subtitle">Create and manage your text messages</p>
        </header>

        {/* Create Form */}
        <div className="card create-section">
          <h2>Create New Message</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <textarea
                className="textarea"
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows="4"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
              ✨ Create Message
            </button>
          </form>
          {successMessage && <div className="success-banner">{successMessage}</div>}
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Messages List */}
        <div className="card messages-section">
          <div className="section-header">
            <h2>All Messages</h2>
            <button className="btn btn-secondary" onClick={fetchTexts}>
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading messages...</p>
            </div>
          ) : texts.length === 0 ? (
            <div className="empty-state">
              <p>📭 No messages yet. Create your first message above!</p>
            </div>
          ) : (
            <div className="messages-list">
              {texts.map((text) => (
                <div key={text.id} className="message-card">
                  <div className="message-content">
                    <div className="message-id">ID: {text.id.substring(0, 8)}...</div>
                    <p className="message-text">{text.message}</p>
                  </div>
                  <div className="message-actions">
                    <button 
                      className="btn btn-edit"
                      onClick={() => handleUpdate(text.id)}
                      title="Edit (Not implemented)"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-delete"
                      onClick={() => handleDelete(text.id)}
                      title="Delete (Not implemented)"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="footer">
          <p>INT531 - Monitoring Tools Project</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
