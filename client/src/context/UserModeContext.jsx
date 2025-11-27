import { createContext, useContext, useState, useEffect } from 'react';

const UserModeContext = createContext(null);

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within UserModeProvider');
  }
  return context;
};

export const UserModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('userMode') || 'buyer';
  });

  useEffect(() => {
    localStorage.setItem('userMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'buyer' ? 'seller' : 'buyer');
  };

  const setBuyerMode = () => setMode('buyer');
  const setSellerMode = () => setMode('seller');

  const value = {
    mode,
    isBuyer: mode === 'buyer',
    isSeller: mode === 'seller',
    toggleMode,
    setBuyerMode,
    setSellerMode
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};
