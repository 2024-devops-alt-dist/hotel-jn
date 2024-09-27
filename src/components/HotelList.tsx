import React from 'react';

interface HotelListProps {
  hotels: any[]; // The list of hotels
}

const HotelList: React.FC<HotelListProps> = ({ hotels }) => {
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
};

export default HotelList;
