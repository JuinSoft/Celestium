import React from 'react';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';

function ConnectWalletButton({ className = '', size = 'md' }) {
  const { isConnected, connectFreighter, isLoading, error } = useWallet();

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  };

  const buttonClass = `btn-primary ${sizeClasses[size]} ${className}`;

  if (isConnected) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={connectFreighter}
        disabled={isLoading}
        className={buttonClass}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </div>
        ) : (
          'Connect Wallet'
        )}
      </motion.button>
      
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
      
      {!isConnected && !error && (
        <p className="mt-2 text-xs text-slate-400">
          Connect with Freighter to mint and purchase NFTs
        </p>
      )}
    </div>
  );
}

export default ConnectWalletButton; 