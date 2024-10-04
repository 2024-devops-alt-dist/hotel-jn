import React from 'react';
import ReservationsList from '../components/ReservationsList';
import Navbar from '../components/Navbar';

const CustomerPage: React.FC = () => {
  return (
    <div style={styles.container}>
        <Navbar />
      <h1>Welcome, Customer</h1>
      <ReservationsList />
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: 'auto',
    textAlign: 'center' as const,
  },
};

export default CustomerPage;
