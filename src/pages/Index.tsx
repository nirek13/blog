
import React, { useState, useEffect } from 'react';
import PasswordGate from '../components/PasswordGate';
import CosmicBlog from '../components/CosmicBlog';

const Index = () => {
  const [userClearance, setUserClearance] = useState<'admin' | 'friend' | 'public' | null>(
    localStorage.getItem('user-clearance') as any
  );

  const handleAccess = (clearanceLevel: 'admin' | 'friend' | 'public') => {
    setUserClearance(clearanceLevel);
    localStorage.setItem('user-clearance', clearanceLevel);
  };

  const handleLogout = () => {
    setUserClearance(null);
    localStorage.removeItem('user-clearance');
  };

  if (!userClearance) {
    return <PasswordGate onAccess={handleAccess} />;
  }

  return (
    <CosmicBlog 
      userClearance={userClearance} 
      onLogout={handleLogout}
    />
  );
};

export default Index;
