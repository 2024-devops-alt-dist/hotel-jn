import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firestore import
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
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

  const canCancelReservation = (entryDate: string) => {
    const entry = new Date(entryDate);
    const today = new Date();
    const diffInTime = entry.getTime() - today.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays >= 3; // Allow cancellation only if today is at least 3 days before the entry date
  };

  const handleDelete = async (reservationId: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', reservationId));
      setReservations((prevReservations) => 
        prevReservations.filter((reservation) => reservation.id !== reservationId)
      );
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

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
            {canCancelReservation(reservation.entryDate) ? (
              <button
                onClick={() => handleDelete(reservation.id)}
                style={styles.button}
              >
                Cancel Reservation
              </button>
            ) : (
              <p style={{ color: 'red' }}>Cannot cancel within 3 days of entry date</p>
            )}
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
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ReservationsList;
