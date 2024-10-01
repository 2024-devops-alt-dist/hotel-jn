import React from 'react';
import Navbar from '../components/Navbar'; // Assuming you have a Navbar component

const ManagerBoard: React.FC = () => {
  return (
    <div style={styles.container}>
      <Navbar /> {/* Optional: If you want a Navbar */}
      <div style={styles.content}>
        <h1>Hello!! You're on the manager dashboard</h1>
      </div>
    </div>
  );
};

const styles = {
  container: {
    // padding: '2',
    // backgroundColor: '#f9f9f9',
    // minHeight: '100vh',
  },
  content: {
    // textAlign: 'center',
    // marginTop: 2,
  },
};

export default ManagerBoard;
