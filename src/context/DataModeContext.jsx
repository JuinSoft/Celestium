import React, { createContext, useState, useContext, useEffect } from 'react';

const DataModeContext = createContext();

export function useDataMode() {
  return useContext(DataModeContext);
}

export function DataModeProvider({ children }) {
  // Check localStorage for saved preference, default to demo mode
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const savedMode = localStorage.getItem('celestium-demo-mode');
    return savedMode !== 'false'; // Default to demo mode (true) if not explicitly set to false
  });

  // Save mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('celestium-demo-mode', isDemoMode.toString());
  }, [isDemoMode]);

  const toggleDataMode = () => {
    setIsDemoMode(prevMode => !prevMode);
  };

  const value = {
    isDemoMode,
    toggleDataMode
  };

  return (
    <DataModeContext.Provider value={value}>
      {children}
    </DataModeContext.Provider>
  );
} 