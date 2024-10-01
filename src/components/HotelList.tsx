import React from 'react';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore'; // Firestore functions to delete data

interface HotelListProps {
  hotels: any[];
  onDeleteHotel: (hotelId: string) => void;
  onEditHotel: (hotel: any) => void;
}

const HotelList: React.FC<HotelListProps> = ({ hotels, onDeleteHotel, onEditHotel }) => {
  const handleDelete = async (hotelId: string) => {
    try {
      await deleteDoc(doc(db, 'hotels', hotelId)); // Delete hotel from Firestore
      onDeleteHotel(hotelId); // Call the callback to update the state
    } catch (error) {
      console.error('Failed to delete hotel:', error);
    }
  };

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
            {hotel.imageUrl && (
              <img src={hotel.imageUrl} alt={hotel.name} style={styles.image} />
            )}
            {hotel.managerLastName && (
              <p><strong>Manager:</strong> {hotel.managerLastName}</p>
            )}
            <button onClick={() => onEditHotel(hotel)} style={styles.editButton}>
              Edit
            </button>
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
  image: {
    width: '100%',
    maxWidth: '400px',
    borderRadius: '8px',
  },
  editButton: {
    marginRight: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default HotelList;
