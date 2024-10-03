import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firestore import
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthProvider'; // Assuming you have AuthProvider to get currentUser

const ReservationsList: React.FC = () => {
  const { currentUser } = useAuth(); // Assuming currentUser includes customerId
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsRef = collection(db, 'bookings');
        const q = query(reservationsRef, where('customerId', '==', currentUser?.uid));
        const querySnapshot = await getDocs(q);
        const reservationsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservations(reservationsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setError('Failed to load reservations.');
        setLoading(false);
      }
    };

    if (currentUser?.uid) {
      fetchReservations();
    }
  }, [currentUser]);

  if (loading) {
    return <p>Loading reservations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!reservations.length) {
    return <p>No reservations found.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Your Reservations</h2>
      <ul style={styles.list}>
        {reservations.map((reservation) => (
          <li key={reservation.id} style={styles.listItem}>
            <p>Suite ID: {reservation.suiteId}</p>
            <p>Entry Date: {reservation.entryDate}</p>
            <p>Release Date: {reservation.releaseDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: 'auto',
  },
  list: {
    listStyleType: 'none' as const,
    padding: 0,
  },
  listItem: {
    padding: '1rem',
    borderBottom: '1px solid #ddd',
  },
};

export default ReservationsList;
