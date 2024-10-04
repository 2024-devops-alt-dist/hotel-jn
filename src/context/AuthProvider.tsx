import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import Firestore (db)
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions to fetch user data

interface AuthContextProps {
  currentUser: User | null;
  firstName?: string; // Optional first name
  lastName?: string;  // Optional last name
  role?: string;      // Optional role (admin, customer, etc.)
  hotelId?: string; 
  hotelName?: string;
  // hotelId?: string | undefined; 
  // hotelName?: string | undefined;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context; // Now TypeScript knows context is not undefined
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string | undefined>(undefined); // State for first name
  const [lastName, setLastName] = useState<string | undefined>(undefined);   // State for last name
  const [role, setRole] = useState<string | undefined>(undefined);           // State for role
  const [hotelId, setHotelId] = useState<string | undefined>(undefined);           // State for hotelId
  const [hotelName, setHotelName] = useState<string | undefined>(undefined);           // State for hotelName
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFirstName(userData.firstName); // Set first name
          setLastName(userData.lastName);   // Set last name
          setRole(userData.role);           // Set user role (e.g., admin, customer)
          setHotelId(userData.hotelId);     // Set hotelId
          setHotelName(userData.hotelName); // Set hotelName
        }

        setCurrentUser(user); // Set the Firebase auth user
      } else {
        setCurrentUser(null);
        setFirstName(undefined);
        setLastName(undefined);
        setRole(undefined);
        setHotelId(undefined);
        setHotelName(undefined);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    firstName, // Provide first name in context
    lastName,  // Provide last name in context
    role,      // Provide role in context
    hotelId,
    hotelName
  };

  console.log(value);

  return (
    <AuthContext.Provider value={value}> 
      {!loading && children}
    </AuthContext.Provider>
  );
};
