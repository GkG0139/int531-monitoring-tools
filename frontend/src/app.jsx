import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const BACKEND_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BACKEND_URL}/texts`);
      // Ensure we always set an array
      const data = response.data;
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setError('Failed to load notes. Please check if backend is running.');
      setNotes([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setError(null);
      await axios.post(`${BACKEND_URL}/texts`, { text: newNote }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setNewNote('');
      showSuccess('✓ Note created successfully!');
      await fetchNotes();
    } catch (err) {
      console.error("Failed to create note:", err);
      setError('Failed to create note.');
    }
  };

  const handleEditStart = (note) => {
    setEditingId(note.id);
    setEditText(note.message);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleEditSave = async (id) => {
    if (!editText.trim()) {
      setError('Note cannot be empty.');
      return;
    }

    try {
      setError(null);
      await axios.put(`${BACKEND_URL}/texts/${id}`, { text: editText }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setEditingId(null);
      setEditText('');
      showSuccess('✓ Note updated successfully!');
      await fetchNotes();
    } catch (err) {
      console.error("Failed to update note:", err);
      setError('Failed to update note.');
    }
  };

  const handleDeleteRequest = (note) => {
    setDeleteConfirm(note);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      setError(null);
      await axios.delete(`${BACKEND_URL}/texts/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      showSuccess('✓ Note deleted successfully!');
      await fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError('Failed to delete note.');
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🧠 My Memory Notes</h1>
          <p className="subtitle">Capture your thoughts, preserve your memories</p>
        </header>

        {/* Create Form */}
        <div className="card create-section">
          <h2>✨ Create New Memory</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <textarea
                className="textarea"
                placeholder="What's on your mind? Write down your thoughts, ideas, or memories..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows="4"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!newNote.trim()}>
              💾 Save Memory
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

        {/* Notes List */}
        <div className="card notes-section">
          <div className="section-header">
            <h2>📚 All Memories</h2>
            <button className="btn btn-secondary" onClick={fetchNotes}>
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading your memories...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <p>📭 No memories yet. Create your first memory above!</p>
            </div>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <div key={note.id} className={`note-card ${editingId === note.id ? 'editing' : ''}`}>
                  {editingId === note.id ? (
                    // Edit Mode
                    <>
                      <div className="note-content">
                        <textarea
                          className="edit-textarea"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows="3"
                          autoFocus
                        />
                      </div>
                      <div className="note-actions">
                        <button
                          className="btn btn-save"
                          onClick={() => handleEditSave(note.id)}
                        >
                          ✓ Save
                        </button>
                        <button
                          className="btn btn-cancel"
                          onClick={handleEditCancel}
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <div className="note-content">
                        <div className="note-id">ID: {note.id.substring(0, 8)}...</div>
                        <p className="note-text">{note.message}</p>
                      </div>
                      <div className="note-actions">
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEditStart(note)}
                          title="Edit this memory"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDeleteRequest(note)}
                          title="Delete this memory"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div className="modal-overlay" onClick={handleDeleteCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🗑️ Delete Memory?</h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this memory?</p>
                <div className="delete-preview">
                  <strong>"{deleteConfirm.message}"</strong>
                </div>
                <p className="warning-text">This action cannot be undone.</p>
              </div>
              <div className="modal-actions">
                <button className="btn btn-cancel" onClick={handleDeleteCancel}>
                  ✕ Cancel
                </button>
                <button className="btn btn-delete-confirm" onClick={handleDeleteConfirm}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="footer">
          <p>INT531 - Memory Notes Project 🧠</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
