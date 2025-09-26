// pages/ConstructorPage.jsx
import React from 'react';
import Constructor from '../components/Constructor';

const ConstructorPage = () => {
  return (
    <main className="constructor-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Constructor />
      </div>
    </main>
  );
};

export default ConstructorPage;