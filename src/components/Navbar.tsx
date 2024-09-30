import React from 'react';
import { useAuth } from '../context/AuthProvider'; // To get user data
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { currentUser, firstName, lastName } = useAuth(); // Get user data
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to landing page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <h1>Hôtel Clair de Lune</h1>
        <div>
          {currentUser ? (
            <div>
              <span>{firstName} {lastName}</span> {/* Display user's name */}
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : (
            <div>
              <button onClick={() => navigate('/login')} style={styles.navButton}>
                Login
              </button>
              <button onClick={() => navigate('/signup')} style={styles.navButton}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: '1rem',
    backgroundColor: '#333',
    color: '#fff',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    marginLeft: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  logoutButton: {
    marginLeft: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;

