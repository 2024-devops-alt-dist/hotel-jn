import React, { useState } from 'react';
import { db } from '../firebase'; // Firestore import
import { doc, updateDoc } from 'firebase/firestore';

interface EditManagerModalProps {
  manager: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedManager: any) => void; // Callback to update the manager in the list
}

const EditManagerModal: React.FC<EditManagerModalProps> = ({ manager, isOpen, onClose, onUpdate }) => {
  const [firstName, setFirstName] = useState(manager.firstName);
  const [lastName, setLastName] = useState(manager.lastName);
  const [email, setEmail] = useState(manager.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Update manager in Firestore
      const managerRef = doc(db, 'users', manager.id);
      await updateDoc(managerRef, {
        firstName,
        lastName,
        email,
      });

      // Trigger the update callback
      onUpdate({ ...manager, firstName, lastName, email });
      setLoading(false);
      onClose(); // Close the modal after updating
    } catch (error: any) {
      setError('Failed to update manager. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modal}>
        <h2>Edit Manager</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
            style={styles.input}
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
            style={styles.input}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Updating...' : 'Update Manager'}
          </button>
        </form>
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  modalBackdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  closeButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default EditManagerModal;
