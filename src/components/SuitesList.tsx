// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Firestore import
// import { collection, query, where, getDocs } from 'firebase/firestore';

// interface SuitesListProps {
//   hotelId: string| undefined; // hotelId passed from parent
// }

// const SuitesList: React.FC<SuitesListProps> = ({ hotelId }) => {
//   const [suites, setSuites] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSuites = async () => {
//       try {
//         if (hotelId) {
//           const suitesRef = collection(db, 'suites');
//           const q = query(suitesRef, where('hotelId', '==', hotelId));
//           const querySnapshot = await getDocs(q);
//           const suitesList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setSuites(suitesList);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching suites:', error);
//         setLoading(false);
//       }
//     };

//     fetchSuites();
//   }, [hotelId]);

//   if (loading) {
//     return <p>Loading suites...</p>;
//   }

//   if (!suites.length) {
//     return <p>No suites found for this hotel.</p>;
//   }

//   return (
//     <div style={styles.container}>
//       <h2>Suites List</h2>
//       <table style={styles.table}>
//         <thead>
//           <tr>
//             <th style={styles.th}>Title</th>
//             <th style={styles.th}>Description</th>
//             <th style={styles.th}>Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           {suites.map((suite) => (
//             <tr key={suite.id}>
//               <td style={styles.td}>{suite.title}</td>
//               <td style={styles.td}>{suite.description}</td>
//               <td style={styles.td}>{suite.price}€</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: '2rem',
//     backgroundColor: '#f9f9f9',
//     borderRadius: '8px',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse' as const,
//   },
//   th: {
//     padding: '16px',
//     textAlign: 'left' as const,
//     backgroundColor: '#007bff',
//     color: '#fff',
//     borderBottom: '2px solid #ddd',
//   },
//   td: {
//     padding: '16px',
//     textAlign: 'left' as const,
//     borderBottom: '1px solid #ddd',
//   },
// };

// export default SuitesList;

import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firestore import
import { collection, query, where, getDocs } from 'firebase/firestore';

interface SuitesListProps {
  hotelId: string | undefined; // hotelId passed from parent
}

const SuitesList: React.FC<SuitesListProps> = ({ hotelId }) => {
  const [suites, setSuites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuites = async () => {
      try {
        if (hotelId) {
          const suitesRef = collection(db, 'suites');
          const q = query(suitesRef, where('hotelId', '==', hotelId));
          const querySnapshot = await getDocs(q);
          const suitesList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSuites(suitesList);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching suites:', error);
        setLoading(false);
      }
    };

    fetchSuites();
  }, [hotelId]);

  if (loading) {
    return <p>Loading suites...</p>;
  }

  if (!suites.length) {
    return <p>No suites found for this hotel.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Suites List</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Main Image</th>
            <th style={styles.th}>Additional Images</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Price</th>
          </tr>
        </thead>
        <tbody>
          {suites.map((suite) => (
            <tr key={suite.id}>
              <td style={styles.td}>{suite.title}</td>
              <td style={styles.td}>
                <img src={suite.main_image} alt="Main Image" style={styles.image} />
              </td>
              <td style={styles.td}>
                {suite.images && suite.images.length > 0 ? (
                  suite.images.map((image: string, index: number) => (
                    <img key={index} src={image} alt={`Suite Image ${index}`} style={styles.image} />
                  ))
                ) : (
                  <p>No additional images</p>
                )}
              </td>
              <td style={styles.td}>{suite.description}</td>
              <td style={styles.td}>{suite.price}€</td>
            </tr>
          ))}
        </tbody>
      </table>
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
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    padding: '16px',
    textAlign: 'left' as const,
    backgroundColor: '#007bff',
    color: '#fff',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '16px',
    textAlign: 'left' as const,
    borderBottom: '1px solid #ddd',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
    margin: '4px',
  },
};

export default SuitesList;
