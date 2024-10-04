import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; // Firestore import
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import VisitorSuitesList from '../components/VisitorSuitesList';
import Navbar from '../components/Navbar';

const HotelPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>(); // Get hotelId from the URL
  const [hotel, setHotel] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch hotel details from Firestore
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        if(hotelId){
            const hotelRef = doc(db, 'hotels', hotelId);
            const hotelDoc = await getDoc(hotelRef);
            if (hotelDoc.exists()) {
              setHotel(hotelDoc.data());
            } else {
              console.error('No such hotel!');
            }
            setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotel();
    }
  }, [hotelId]);

  if (loading) {
    return <p>Loading hotel details...</p>;
  }

  if (!hotel) {
    return <p>Hotel not found!</p>;
  }

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.hotelDetails}>
        <img src={hotel.imageUrl} alt={hotel.name} style={styles.hotelImage} />
        <h1>{hotel.name}</h1>
        <p>{hotel.city}</p>
        <p>{hotel.address}</p>
        <p>{hotel.description}</p>
      </div>
      <VisitorSuitesList hotelId={hotelId} />
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  hotelDetails: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  hotelImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
  },
};

export default HotelPage;
