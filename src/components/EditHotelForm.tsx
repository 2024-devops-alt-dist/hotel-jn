import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore'; // Firestore update function

interface EditHotelFormProps {
  hotel: any;
  onEditHotel: (updatedHotel: any) => void; // Callback to update the hotel list after editing
}

const EditHotelForm: React.FC<EditHotelFormProps> = ({ hotel, onEditHotel }) => {
  const [name, setName] = useState(hotel.name);
  const [city, setCity] = useState(hotel.city);
  const [address, setAddress] = useState(hotel.address);
  const [description, setDescription] = useState(hotel.description);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const updatedHotel = {
        name,
        city,
        address,
        description,
      };

      // Update hotel in Firestore
      const hotelRef = doc(db, 'hotels', hotel.id);
      await updateDoc(hotelRef, updatedHotel);

      // Trigger callback to update the list in the parent component
      onEditHotel({ id: hotel.id, ...updatedHotel });

      setSuccess('Hotel updated successfully!');
    } catch (error: any) {
      setError('Failed to update hotel. Please try again.');
    }
  };

  return (
    <div>
      <h2>Edit Hotel</h2>
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
          Update Hotel
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

export default EditHotelForm;
