import React from 'react';
import AddHotelForm from '../components/AddHotelForm'; // Import the form


const Dashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>You're on the dashboard page</h1>
      <AddHotelForm /> {/* Add the form to the dashboard */}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '2rem',
    backgroundColor: '#f5f5f5',
  },
};

export default Dashboard;
