import React, { useState, useEffect } from 'react';
import AddHotelForm from '../components/AddHotelForm';
import HotelList from '../components/HotelList';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Dashboard: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial list of hotels
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

  // Function to add a new hotel to the list
  const handleAddHotel = (newHotel: any) => {
    setHotels((prevHotels) => [...prevHotels, newHotel]);
  };

  // Function to delete a hotel from the list
  const handleDeleteHotel = (hotelId: string) => {
    setHotels((prevHotels) => prevHotels.filter((hotel) => hotel.id !== hotelId));
  };

  if (loading) {
    return <p>Loading hotels...</p>;
  }

  return (
    <div style={styles.container}>
      <h1>You're on the dashboard page</h1>
      <AddHotelForm onAddHotel={handleAddHotel} />
      <HotelList hotels={hotels} onDeleteHotel={handleDeleteHotel} /> {/* Pass the delete handler */}
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
