// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';

import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Import the Firestore instance

const App: React.FC = () => {
  // useEffect(() => {
  //   const fetchTest = async () => {
  //     const querySnapshot = await getDocs(collection(db, 'test'));
  //     querySnapshot.forEach((doc) => {
  //       console.log(`${doc.id} => ${doc.data()}`);
  //     });
  //   };

  //   fetchTest();
  // }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
