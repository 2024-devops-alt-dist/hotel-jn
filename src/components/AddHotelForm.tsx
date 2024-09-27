import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface AddHotelFormProps {
  onAddHotel: (newHotel: any) => void; // Callback to update the hotel list
}

const AddHotelForm: React.FC<AddHotelFormProps> = ({ onAddHotel }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const newHotel = {
        name,
        city,
        address,
        description,
      };

      // Add hotel details to Firestore
      const docRef = await addDoc(collection(db, 'hotels'), newHotel);

      // Trigger callback to update the list with the newly added hotel
      onAddHotel({ id: docRef.id, ...newHotel });

      // Clear form fields on success
      setName('');
      setCity('');
      setAddress('');
      setDescription('');
      setSuccess('Hotel added successfully!');
    } catch (error: any) {
      setError('Failed to add hotel. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add New Hotel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hotel Name"
          required
          style={styles.input}
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          required
          style={styles.input}
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          required
          style={styles.input}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>
          Add Hotel
        </button>
      </form>
    </div>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    margin: '1rem 0',
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
};

export default AddHotelForm;
