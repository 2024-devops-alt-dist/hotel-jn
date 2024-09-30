import React from 'react';

interface HotelCardProps {
  hotel: {
    name: string;
    city: string;
    address: string;
    description: string;
    imageUrl?: string;
  };
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
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
      </div>
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
};

export default HotelCard;
