import React, { useState } from 'react';
import ContactFormModal from './ContactFormModal'; // Import the modal component

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    city: string;
    address: string;
    description: string;
    imageUrl?: string;
  };
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  return (
    <div style={styles.card}>
      {hotel.imageUrl && (
        <img src={hotel.imageUrl} alt={hotel.name} style={styles.image} />
      )}
      <div style={styles.info}>
        <h3>{hotel.name}</h3>
        <p><strong>City:</strong> {hotel.city}</p>
        <p><strong>Address:</strong> {hotel.address}</p>
        <p>{hotel.description}</p>
        <button onClick={() => setIsModalOpen(true)} style={styles.button}>
          Contact Hotel
        </button>
      </div>

      {/* Render the contact form modal */}
      {isModalOpen && (
        <ContactFormModal
          hotel={hotel}
          onClose={() => setIsModalOpen(false)} // Close modal handler
        />
      )}
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    width: '300px',
    margin: '1rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
  },
  info: {
    padding: '1rem',
  },
  button: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default HotelCard;
