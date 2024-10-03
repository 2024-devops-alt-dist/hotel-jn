// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ManagerBoard from './pages/ManagerBoard';
import HotelPage from './pages/HotelPage';
import BookingForm from './pages/BookingForm';


  const App: React.FC = () => {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/hotel/:hotelId/suites" element={<HotelPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Protect the home route with PrivateRoute */}
            <Route
              path="/suites/:suiteId"
              element={
                <PrivateRoute requiredRole="customer">
                  <BookingForm  />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute requiredRole="admin">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/managerboard"
              element={
                <PrivateRoute requiredRole="manager">
                  <ManagerBoard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    );
  };

export default App;
