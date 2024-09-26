// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>Hôtel Clair de Lune</h1>
      <div>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/signup" style={styles.link}>Sign Up</Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#333',
    color: 'white',
  },
  logo: {
    fontSize: '1.5rem',
  },
  link: {
    marginLeft: '1rem',
    color: 'white',
    textDecoration: 'none',
  },
};

export default Navbar;
