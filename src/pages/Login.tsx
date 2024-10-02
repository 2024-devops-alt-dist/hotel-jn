import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // Use the Auth context to access user data

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser, role } = useAuth(); // Get currentUser and role from context

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Redirect based on role
  useEffect(() => {
    if (currentUser) {
      if (role === 'admin') {
        navigate('/dashboard'); // Redirect admin users to dashboard
      } else if (role === 'manager') {
        navigate('/managerboard'); // Redirect managers to managerboard
      } else if (role === 'customer') {
        navigate('/'); // Redirect customer users to landing page
      } else {
        navigate('/home'); // Default redirection for other users
      }
    }
  }, [currentUser, role, navigate]);

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
