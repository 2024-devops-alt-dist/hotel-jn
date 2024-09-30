import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firestore import
import { collection, getDocs } from 'firebase/firestore';

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'messages'));
        const messageList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messageList);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Contact Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Hotel Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.email}</td>
                <td>{message.subject}</td>
                <td>{message.message}</td>
                <td>{message.hotelName}</td>
                <td>{new Date(message.createdAt.seconds * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// const styles = {
//   container: {
//     padding: '2rem',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse' as const,
//     marginTop: '1rem',
//   },
//   th: {
//     border: '1px solid #ccc',
//     padding: '8px',
//     textAlign: 'left' as const,
//   },
//   td: {
//     border: '1px solid #ccc',
//     padding: '8px',
//   },
// };

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
      ':hover': {
        backgroundColor: '#f1f1f1',
      },
    },
  };
  

export default MessageList;
