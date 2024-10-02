import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firestore import
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import EditSuiteModal from './EditSuiteModal';


interface SuitesListProps {
  hotelId: string | undefined; // hotelId passed from parent
}

const SuitesList: React.FC<SuitesListProps> = ({ hotelId }) => {
  const [suites, setSuites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuite, setSelectedSuite] = useState<any | null>(null); // For editing
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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

   // Handle deleting a suite
   const handleDelete = async (suiteId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this suite?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'suites', suiteId));
      setSuites(suites.filter((suite) => suite.id !== suiteId)); // Remove from UI
    } catch (error) {
      console.error('Error deleting suite:', error);
    }
  };

  // Handle opening the update modal
  const handleEdit = (suite: any) => {
    setSelectedSuite(suite);
    setIsUpdateModalOpen(true);
  };

  // Handle closing the update modal
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedSuite(null);
  };

  // Handle updating the suite in the list
  const handleUpdateSuite = (updatedSuite: any) => {
    setSuites(suites.map((suite) => (suite.id === updatedSuite.id ? updatedSuite : suite)));
  };

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
            <th style={styles.th}>Actions</th>
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
              <td style={styles.td}>
                <button onClick={() => handleEdit(suite)} style={styles.editButton}>
                  Edit
                </button>
                <button onClick={() => handleDelete(suite.id)} style={styles.deleteButton}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSuite && (
        <EditSuiteModal
          isOpen={isUpdateModalOpen}
          onClose={closeUpdateModal}
          suite={selectedSuite}
          onUpdate={handleUpdateSuite}
        />
      )}
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
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ffc107',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default SuitesList;
