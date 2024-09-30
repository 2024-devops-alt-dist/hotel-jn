import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider'; // To get current user
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface ContactFormModalProps {
  hotel: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ hotel, onClose }) => {
  const { currentUser } = useAuth(); // Get the current logged-in user
  const [email, setEmail] = useState(currentUser?.email ?? ''); // Ensure the value is always a string
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If the user is logged in, set their email when the component mounts
  useEffect(() => {
    if (currentUser && currentUser.email) {
      setEmail(currentUser.email); // Set email only if it's not null
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Store the message in Firestore
      await addDoc(collection(db, 'messages'), {
        hotelId: hotel.id,
        hotelName: hotel.name,
        email,
        subject,
        message,
        createdAt: new Date(),
      });

      setSuccess('Message sent successfully!');
      setEmail(currentUser?.email ?? ''); // Reset form but keep user's email if logged in
      setSubject('');
      setMessage('');
    } catch (error) {
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2>Contact {hotel.name}</h2>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Allow editing if visitor
            placeholder="Your Email"
            required
            style={styles.input}
            disabled={!!currentUser} // Disable email field if user is logged in
          />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={styles.input}
          >
            <option value="" disabled>Select a subject</option>
            <option value="complaint">I wish to make a complaint</option>
            <option value="service">I would like to order an additional service</option>
            <option value="suite">I would like to know more about a hotel suite</option>
            <option value="application">I have a problem with this application</option>
          </select>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            required
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Send Message</button>
        </form>
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  modal: {
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
  modalContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
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
  textarea: {
    padding: '0.5rem',
    fontSize: '1rem',
    height: '100px',
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

export default ContactFormModal;
