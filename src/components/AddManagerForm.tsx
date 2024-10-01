import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Firebase imports
import { collection, getDocs, setDoc, updateDoc, query, where, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const AddManagerForm: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedHotelName, setSelectedHotelName] = useState(''); // Store hotel name
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch hotels without a manager
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotelsRef = collection(db, 'hotels');
        const querySnapshot = await getDocs(query(hotelsRef, where('managerId', 'in', [null, '']))); // Handle missing or null managerId
        const hotelList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name, // Get hotel name for easy selection
          city: doc.data().city,
          ...doc.data(),
        }));
        setHotels(hotelList);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
      }
    };

    fetchHotels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Create the manager in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store manager info in Firestore, including hotel name
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        firstName,
        lastName,
        role: 'manager',
        hotelId: selectedHotel,
        hotelName: selectedHotelName, // Store hotel name with manager
      });

      // Update the hotel with the manager's ID and last name
      const hotelRef = doc(db, 'hotels', selectedHotel);
      await updateDoc(hotelRef, { managerId: user.uid, managerLastName: lastName });

      setSuccess('Manager added successfully!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setSelectedHotel('');
      setSelectedHotelName(''); // Reset hotel name
    } catch (error: any) {
      setError(error.message || 'Failed to add manager.');
    }
  };

  const handleHotelSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHotelId = e.target.value;
    const hotel = hotels.find((hotel) => hotel.id === selectedHotelId);
    if (hotel) {
      setSelectedHotel(selectedHotelId);
      setSelectedHotelName(hotel.name); // Set the selected hotel's name
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add a Manager</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
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
          placeholder="Manager's Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <select
          value={selectedHotel}
          onChange={handleHotelSelection} // Handle both hotel ID and name
          required
          style={styles.input}
        >
          <option value="" disabled>Select a hotel</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name} - {hotel.city}
            </option>
          ))}
        </select>
        <button type="submit" style={styles.button}>Add Manager</button>
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
};

export default AddManagerForm;
