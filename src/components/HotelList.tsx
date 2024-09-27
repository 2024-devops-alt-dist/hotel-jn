import React from 'react';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore'; // Firestore functions to delete data

interface HotelListProps {
  hotels: any[];
  onDeleteHotel: (hotelId: string) => void; // Callback to update the hotel list after deletion
}

const HotelList: React.FC<HotelListProps> = ({ hotels, onDeleteHotel }) => {
  const handleDelete = async (hotelId: string) => {
    try {
      await deleteDoc(doc(db, 'hotels', hotelId)); // Delete hotel from Firestore
      onDeleteHotel(hotelId); // Call the callback to update the state
    } catch (error) {
      console.error('Failed to delete hotel:', error);
    }
  };

  if (hotels.length === 0) {
    return <p>No hotels found.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>List of Hotels</h2>
      <ul style={styles.list}>
        {hotels.map((hotel) => (
          <li key={hotel.id} style={styles.listItem}>
            <h3>{hotel.name}</h3>
            <p><strong>City:</strong> {hotel.city}</p>
            <p><strong>Address:</strong> {hotel.address}</p>
            <p><strong>Description:</strong> {hotel.description}</p>
            <button onClick={() => handleDelete(hotel.id)} style={styles.deleteButton}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '2rem',
  },
  list: {
    listStyleType: 'none' as const,
    padding: 0,
  },
  listItem: {
    marginBottom: '1rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  deleteButton: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default HotelList;
