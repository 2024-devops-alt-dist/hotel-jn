// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';

import { AuthProvider } from './context/AuthProvider';


import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Import the Firestore instance

// useEffect(() => {
  //   const fetchTest = async () => {
    //     const querySnapshot = await getDocs(collection(db, 'test'));
    //     querySnapshot.forEach((doc) => {
      //       console.log(`${doc.id} => ${doc.data()}`);
      //     });
      //   };
      
      //   fetchTest();
      // }, []);
      const App: React.FC = () => {
        return (
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                {/* Protect the home route with PrivateRoute */}
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
          </AuthProvider>
        );
      };

export default App;
