import React from 'react';
import Navbar from '../components/Navbar';

const LandingPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <section style={styles.section}>
        <h1>Bienvenue à l'Hôtel Clair de Lune</h1>
        <p>Profitez d'un séjour inoubliable avec nous dans l'une de nos suites luxueuses.</p>
      </section>
    </div>
  );
};

const styles = {
  section: {
    padding: '2rem',
    textAlign: 'center' as const,
  },
};

export default LandingPage;
