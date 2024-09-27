import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Assuming Firestore is initialized
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions for storing data
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // State for first name
  const [lastName, setLastName] = useState(''); // State for last name
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Optional loading state
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Destructure currentUser from the context

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user info in Firestore, including first name, last name, and role
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        firstName: firstName,  // Store first name
        lastName: lastName,    // Store last name
        role: 'customer',      // Assigning default "customer" role
      });

      // Navigate to /home after successful sign-up
      navigate('/home');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to /home if currentUser is authenticated
  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]); // Ensure this only runs when currentUser changes

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
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
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
