// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

import { AuthProvider } from './context/AuthProvider';

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
              path="/dashboard"
              element={
                <PrivateRoute requiredRole="admin">
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    );
  };

export default App;
