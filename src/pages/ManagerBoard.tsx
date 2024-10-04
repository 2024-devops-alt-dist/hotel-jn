import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SuiteFormModal from '../components/SuiteFormModal';
import { useAuth } from '../context/AuthProvider'; // Assuming you're using AuthProvider
import SuitesList from '../components/SuitesList';

const Dashboard: React.FC = () => {
  const [isSuiteModalOpen, setIsSuiteModalOpen] = useState(false);
  const { hotelId, hotelName } = useAuth(); // Access currentUser info from AuthProvider

  const openSuiteModal = () => {
    setIsSuiteModalOpen(true);
  };

  const closeSuiteModal = () => {
    setIsSuiteModalOpen(false);
  };

  // You can check if currentUser is available and handle it accordingly
  // if (!currentUser) {
  //   return <p>Loading user info...</p>; // or handle redirection if user is not authenticated
  // }

  return (
    <div style={styles.container}>
      <Navbar />
      {/* <div style={styles.content}> */}
      <div >
        <h1>Dashboard</h1>
        <p>Manage your hotel: {hotelName} and suites here.</p>

        {/* Button to open the suite modal */}
        <button onClick={openSuiteModal} style={styles.button}>
          Add New Suite
        </button>

        {/* Pass currentUser info to SuiteFormModal */}
        <SuiteFormModal
          isOpen={isSuiteModalOpen}
          onClose={closeSuiteModal}
          hotelId={hotelId}
          hotelName={hotelName} // Passing hotel to modal
        />
        <SuitesList hotelId={hotelId}/>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  content: {
    textAlign: 'center',
    marginTop: '2rem',
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

export default Dashboard;
