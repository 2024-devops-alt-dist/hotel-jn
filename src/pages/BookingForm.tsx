import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase'; // Firestore import
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthProvider'; // Assuming you have AuthProvider to get currentUser
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker CSS
import Navbar from '../components/Navbar';

const BookingForm: React.FC = () => {
  const { suiteId } = useParams<{ suiteId: string }>(); // Get suiteId from the URL

  const { currentUser } = useAuth(); // Assuming currentUser includes customerId
  const [entryDate, setEntryDate] = useState<Date | null>(null);
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]); // To store booked dates
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();


  const today = new Date(); // Get today's date

  useEffect(() => {
    // Fetch all bookings for the selected suite
    const fetchBookedDates = async () => {
      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('suiteId', '==', suiteId));
        const querySnapshot = await getDocs(q);
        const dates: Date[] = [];

        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          const startDate = new Date(booking.entryDate);
          const endDate = new Date(booking.releaseDate);
          // Add each day between entryDate and releaseDate to bookedDates
          for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
          }
        });

        setBookedDates(dates); // Set the booked dates
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      }
    };

    fetchBookedDates();
}, [suiteId]);

const isDateBooked = (date: Date) => {
    //   console.log(bookedDates)
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.getDate() === date.getDate() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getFullYear() === date.getFullYear()
    );
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    if (!entryDate || !releaseDate) {
      setError('Both entry and release dates are required.');
      setLoading(false);
      return;
    }

    const diffInTime = releaseDate.getTime() - entryDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    if (diffInDays < 1) {
      setError("Release date must be at least one day after the entry date.");
      setLoading(false);
      return;
    }

    try {
      if (!currentUser?.uid || !suiteId) {
        throw new Error('Missing customer or suite information.');
      }

      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('suiteId', '==', suiteId),
        where('releaseDate', '>=', entryDate.toISOString().split('T')[0]),
        where('entryDate', '<=', releaseDate.toISOString().split('T')[0])
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('This suite is already booked for the selected dates.');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'bookings'), {
        suiteId,
        customerId: currentUser.uid,
        entryDate: entryDate.toISOString().split('T')[0],
        releaseDate: releaseDate.toISOString().split('T')[0],
        createdAt: new Date(),
      });

      setSuccess('Booking successful!');
      setEntryDate(null);
      setReleaseDate(null);
      // Delay the navigation by 3 seconds (3000 milliseconds)
    setTimeout(() => {
        navigate('/customerpage');
    }, 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to book the suite.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={styles.container}>
        <Navbar />
      <h2>Book Your Stay</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleBooking} style={styles.form}>
        <label>
          Entry Date:
            <DatePicker
                selected={entryDate}
                onChange={(date) => setEntryDate(date)}
                minDate={today}
                excludeDates={bookedDates} // Disable booked dates
                required
                dateFormat="yyyy-MM-dd"
                placeholderText="Select an entry date"
                dayClassName={(date) => (isDateBooked(date) ? 'highlighted-date' : '')} // Add custom class for booked dates
            />
        </label>
        <label>
          Release Date:
          <DatePicker
            selected={releaseDate}
            onChange={(date) => setReleaseDate(date)}
            minDate={entryDate ? new Date(entryDate.getTime() + 24 * 60 * 60 * 1000) : today} // Ensure release date is after entry date
            excludeDates={bookedDates}
            required
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a release date"
            dayClassName={(date) => (isDateBooked(date) ? 'highlighted-date' : '')} // Add custom class for booked dates
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
