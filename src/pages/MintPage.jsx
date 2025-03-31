import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useDataMode } from '../context/DataModeContext';
import { contractService } from '../services/contractService';
import DataModeToggle from '../components/DataModeToggle';

const MintPage = () => {
  const navigate = useNavigate();
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const { isDemoMode } = useDataMode();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    royaltyPercentage: 10 // Default royalty percentage
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'royaltyPercentage' ? parseInt(value) : value
    });
  };
  
  const handleImageUpload = (e) => {
    // In a real app, you would upload to IPFS/Arweave
    // For this demo, we'll just use the file object URL
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        imageUrl
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Check if wallet is connected
      if (!isConnected) {
        await connectWallet();
        if (!isConnected) {
          throw new Error('Please connect your wallet first');
        }
      }
      
      // Validate form data
      if (!formData.name || !formData.description || !formData.imageUrl) {
        throw new Error('Please fill in all required fields');
      }
      
      if (formData.royaltyPercentage < 0 || formData.royaltyPercentage > 100) {
        throw new Error('Royalty percentage must be between 0 and 100');
      }
      
      // Call the contract service to mint NFT
      const result = await contractService.mintNFT(formData, { publicKey: walletAddress });
      
      if (result.success) {
        setSuccessMessage(`NFT minted successfully with ID: ${result.nftId}`);
        // Redirect to the NFT detail page after a short delay
        setTimeout(() => {
          navigate(`/nft/${result.nftId}`);
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to mint NFT');
      }
    } catch (err) {
      console.error('Error minting NFT:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create New NFT</h1>
        <DataModeToggle />
      </div>
      
      {isDemoMode && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
          <p className="font-bold">Demo Mode Active</p>
          <p>NFTs minted in demo mode use mock data and do not interact with the blockchain.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p>{successMessage}</p>
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            NFT Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter a name for your NFT"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe your NFT"
            required
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">
            Image Upload*
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="image"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition"
            >
              Select Image
            </label>
            {formData.imageUrl && (
              <div className="relative w-20 h-20">
                <img
                  src={formData.imageUrl}
                  alt="NFT Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          {!formData.imageUrl && (
            <p className="text-sm text-gray-500 mt-2">
              Please upload an image for your NFT
            </p>
          )}
        </div>
        
        <div className="mb-8">
          <label htmlFor="royaltyPercentage" className="block text-gray-700 font-semibold mb-2">
            Royalty Percentage: {formData.royaltyPercentage}%
          </label>
          <input
            type="range"
            id="royaltyPercentage"
            name="royaltyPercentage"
            min="0"
            max="100"
            step="1"
            value={formData.royaltyPercentage}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This percentage of each sale will go to you as the creator
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !formData.imageUrl}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isDemoMode ? 'Mint NFT (Demo)' : 'Mint NFT'}
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center text-gray-600">
        <p>
          By minting an NFT, you confirm that you own the rights to this content and agree to the terms of service.
        </p>
      </div>
    </motion.div>
  );
};

export default MintPage; 