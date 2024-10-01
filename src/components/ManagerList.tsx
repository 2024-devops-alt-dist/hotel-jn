import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Firestore and Auth imports
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import EditManagerModal from './EditManagerModal';

const ManagerList: React.FC = () => {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedManager, setSelectedManager] = useState<any | null>(null); // For editing
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch managers from Firestore
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const managersRef = collection(db, 'users');
        const q = query(managersRef, where('role', '==', 'manager')); // Query for managers
        const querySnapshot = await getDocs(q);
        const managerList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setManagers(managerList);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch managers:', error);
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  // Handle delete manager
  const handleDelete = async (managerId: string, uid: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this manager?');
    if (!confirmDelete) return;

    try {
      // Delete the manager from Firestore
      await deleteDoc(doc(db, 'users', managerId));

      // Optional: Remove manager from Firebase Authentication
      const user = auth.currentUser; // Assume admin is logged in
      if (user && user.uid === uid) {
        await deleteUser(user); // Delete user from Firebase Auth
      }

      // Remove from local state
      setManagers(managers.filter((manager) => manager.id !== managerId));
      alert('Manager deleted successfully');
    } catch (error) {
      console.error('Failed to delete manager:', error);
      alert('Failed to delete manager.');
    }
  };

  // Handle opening the modal to edit a manager
  const handleEdit = (manager: any) => {
    setSelectedManager(manager);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedManager(null);
  };

  // Update the manager in the list after editing
  const handleUpdateManager = (updatedManager: any) => {
    setManagers(managers.map((manager) => (manager.id === updatedManager.id ? updatedManager : manager)));
  };


  if (loading) {
    return <p>Loading managers...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Managers List</h2>
      {managers.length === 0 ? (
        <p>No managers found.</p>
      ) : (
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>First Name</th>
              <th style={styles.th}>Last Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Hotel Name</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.id} style={styles.tr}>
                <td style={styles.td}>{manager.firstName}</td>
                <td style={styles.td}>{manager.lastName}</td>
                <td style={styles.td}>{manager.email}</td>
                <td style={styles.td}>{manager.hotelName}</td>
                <td style={styles.td}>
                    <button
                        onClick={() => handleEdit(manager)} 
                        style={styles.editButton}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(manager.id, manager.uid)}
                        style={styles.deleteButton}
                    >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedManager && (
        <EditManagerModal
          manager={selectedManager}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdateManager}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  thead: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  th: {
    padding: '16px',
    textAlign: 'left' as const,
    fontWeight: 'bold' as const,
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '16px',
    textAlign: 'left' as const,
    borderBottom: '1px solid #ddd',
    backgroundColor: '#fff',
    transition: 'background-color 0.3s ease',
  },
  tr: {
    // ':hover': {
    //   backgroundColor: '#f1f1f1',
    // },
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ManagerList;
