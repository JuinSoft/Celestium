import React, { createContext, useState, useEffect, useContext } from 'react';
import StellarSdk from '@stellar/stellar-sdk';

// Testnet network passphrase
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

const WalletContext = createContext();

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider({ children }) {
  const [publicKey, setPublicKey] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletType, setWalletType] = useState(null); // 'freighter' or 'albedo' or 'rabet'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.freighter) {
        try {
          const connected = await window.freighter.isConnected();
          if (connected) {
            const publicKey = await window.freighter.getPublicKey();
            setPublicKey(publicKey);
            setIsConnected(true);
            setWalletType('freighter');
            setWalletAddress(publicKey);
          }
        } catch (error) {
          console.error('Error checking Freighter connection:', error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  // Function to connect to Freighter wallet
  const connectFreighter = async () => {
    setIsLoading(true);
    setError(null);

    if (!window.freighter) {
      setError('Freighter extension not installed. Please install Freighter to connect your wallet.');
      setIsLoading(false);
      return;
    }

    try {
      const connected = await window.freighter.isConnected();
      if (!connected) {
        await window.freighter.connect();
      }
      
      const publicKey = await window.freighter.getPublicKey();
      setPublicKey(publicKey);
      setIsConnected(true);
      setWalletType('freighter');
      setWalletAddress(publicKey);
    } catch (error) {
      console.error('Error connecting to Freighter:', error);
      setError('Error connecting to wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setPublicKey(null);
    setIsConnected(false);
    setWalletType(null);
    setWalletAddress('');
  };

  // Function to sign a transaction using Freighter
  const signTransaction = async (transaction) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    if (walletType === 'freighter') {
      try {
        const xdr = transaction.toXDR();
        const signedXdr = await window.freighter.signTransaction(xdr);
        return StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
      } catch (error) {
        console.error('Error signing transaction:', error);
        throw error;
      }
    }
  };

  const value = {
    publicKey,
    isConnected,
    walletType,
    isLoading,
    error,
    connectFreighter,
    disconnectWallet,
    signTransaction,
    walletAddress
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
} 