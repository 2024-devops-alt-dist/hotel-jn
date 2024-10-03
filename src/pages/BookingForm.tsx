import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; // Firestore import
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthProvider'; // Assuming you have AuthProvider to get currentUser

const BookingForm: React.FC = () => {
  const { suiteId } = useParams<{ suiteId: string }>(); // Get suiteId from the URL

  const { currentUser } = useAuth(); // Assuming currentUser includes customerId
  const [entryDate, setEntryDate] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      // Ensure customer and suite are valid
      if (!currentUser?.uid || !suiteId) {
        throw new Error('Missing customer or suite information.');
      }

      // Add the booking to Firestore
      await addDoc(collection(db, 'bookings'), {
        suiteId,
        customerId: currentUser.uid,
        entryDate,
        releaseDate,
        createdAt: new Date(),
      });

      setSuccess('Booking successful!');
      setEntryDate('');
      setReleaseDate('');
    } catch (error: any) {
      setError(error.message || 'Failed to book the suite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Book Your Stay</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleBooking} style={styles.form}>
        <label>
          Entry Date:
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label>
          Release Date:
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Booking...' : 'Book Suite'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: 'auto',
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
    marginBottom: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default BookingForm;
