import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>You're on the dashboard page</h1>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '2rem',
    backgroundColor: '#f5f5f5',
  },
};

export default Dashboard;
