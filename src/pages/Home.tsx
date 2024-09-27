import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // Import useAuth to access user data

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, firstName, lastName } = useAuth(); // Access currentUser, firstName, lastName

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to landing page after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Welcome to Hôtel Clair de Lune</h1>
        {currentUser && (
          <div style={styles.userInfo}>
            {firstName} {lastName} {/* Display first name and last name */}
          </div>
        )}
      </header>
      <p>This is a protected route. Only logged-in users can see this page.</p>
      <button style={styles.button} onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ccc',
  },
  userInfo: {
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  button: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default Home;
