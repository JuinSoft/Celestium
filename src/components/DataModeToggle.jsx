import React from 'react';
import { useDataMode } from '../context/DataModeContext';
import { motion } from 'framer-motion';

function DataModeToggle() {
  const { isDemoMode, toggleDataMode } = useDataMode();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-slate-300">
        {isDemoMode ? 'Demo Mode' : 'Real Data Mode'}
      </span>
      <button
        onClick={toggleDataMode}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-celestial-indigo ${
          isDemoMode ? 'bg-celestial-purple' : 'bg-slate-600'
        }`}
      >
        <span className="sr-only">
          {isDemoMode ? 'Switch to real data mode' : 'Switch to demo mode'}
        </span>
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`inline-block h-4 w-4 transform rounded-full bg-white ${
            isDemoMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-xs text-slate-400">
        {isDemoMode 
          ? 'Using mock data' 
          : 'Using blockchain data'}
      </span>
    </div>
  );
}

export default DataModeToggle; 