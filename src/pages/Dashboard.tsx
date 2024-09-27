import React, { useState, useEffect } from 'react';
import AddHotelForm from '../components/AddHotelForm';
import HotelList from '../components/HotelList';
import { db } from '../firebase'; // Firestore initialization
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions to get hotel data

const Dashboard: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]); // State to manage hotels
  const [loading, setLoading] = useState(true);

  // Fetch initial list of hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'hotels')); // Fetch hotels from Firestore
        const hotelList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotels(hotelList); // Set initial hotel list
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Function to add a new hotel to the list
  const handleAddHotel = (newHotel: any) => {
    setHotels((prevHotels) => [...prevHotels, newHotel]); // Append new hotel to existing list
  };

  if (loading) {
    return <p>Loading hotels...</p>;
  }

  return (
    <div style={styles.container}>
      <h1>You're on the dashboard page</h1>
      <AddHotelForm onAddHotel={handleAddHotel} />
      <HotelList hotels={hotels} />
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
