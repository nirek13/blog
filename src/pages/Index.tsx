
import React, { useState } from 'react';
import PasswordGate from '../components/PasswordGate';
import CosmicBlog from '../components/CosmicBlog';

const Index = () => {
  const [userClearance, setUserClearance] = useState<'admin' | 'friend' | 'public' | null>(null);

  const handleAccess = (clearanceLevel: 'admin' | 'friend' | 'public') => {
    setUserClearance(clearanceLevel);
  };

  const handleLogout = () => {
    setUserClearance(null);
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
