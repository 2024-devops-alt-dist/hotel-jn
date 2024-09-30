import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore';
import HotelCard from '../components/HotelCard'; // Import the HotelCard component

const LandingPage: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the hotels from Firestore
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'hotels'));
        const hotelList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotels(hotelList);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return <p>Loading hotels...</p>;
  }

  return (
    <div>
      <Navbar />
      <section style={styles.section}>
        <h1>Bienvenue à l'Hôtel Clair de Lune</h1>
        <p>Profitez d'un séjour inoubliable avec nous dans l'une de nos suites luxueuses.</p>
      </section>

      <section style={styles.gridSection}>
        <h2>Nos Hôtels</h2>
        <div style={styles.grid}>
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  section: {
    padding: '2rem',
    textAlign: 'center' as const,
  },
  gridSection: {
    padding: '2rem',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    gap: '1rem',
  },
};

export default LandingPage;
