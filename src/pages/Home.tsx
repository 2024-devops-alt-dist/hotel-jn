// src/pages/Home.tsx
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

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
      <h1>Welcome to Hôtel Clair de Lune</h1>
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
  button: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default Home;
