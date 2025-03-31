import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import ConnectWalletButton from '../components/ConnectWalletButton';
import { validateNFTForm, getSpaceImageUrl } from '../utils/helpers';
import { motion } from 'framer-motion';
import StellarSdk from '@stellar/stellar-sdk';

function MintPage() {
  const navigate = useNavigate();
  const { isConnected, publicKey, signTransaction } = useWallet();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    royaltyPercentage: '10',
    price: '100',
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  
  // Generate a random image preview when the component mounts
  useEffect(() => {
    if (!formData.imageUrl) {
      const randomImage = getSpaceImageUrl(Math.random().toString());
      setImagePreview(randomImage);
    }
  }, [formData.imageUrl]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      imageUrl: value
    });
    
    if (value) {
      setImagePreview(value);
    } else {
      // Reset to a random space image if the URL is cleared
      setImagePreview(getSpaceImageUrl(Math.random().toString()));
    }
  };
  
  const handleGenerateRandomImage = () => {
    const randomImage = getSpaceImageUrl(Math.random().toString());
    setImagePreview(randomImage);
    setFormData({
      ...formData,
      imageUrl: randomImage
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use the imagePreview if no custom URL is provided
    const dataToValidate = {
      ...formData,
      imageUrl: formData.imageUrl || imagePreview
    };
    
    // Validate the form
    const { isValid, errors: validationErrors } = validateNFTForm(dataToValidate);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call the mintNFT function from stellarService
      // For this demo, we'll simulate a successful minting
      
      // Simulate a delay for the minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set success and redirect after a short delay
      setMintSuccess(true);
      setTimeout(() => {
        navigate('/gallery');
      }, 3000);
      
    } catch (error) {
      console.error('Error minting NFT:', error);
      setErrors({
        submit: 'Failed to mint NFT. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (mintSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-lg w-full text-center py-16"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">NFT Successfully Minted!</h2>
          <p className="text-slate-300 mb-8">Your NFT has been successfully created and is now available in the gallery.</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/gallery')}
              className="btn-primary"
            >
              View in Gallery
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Mint Your NFT</h1>
          <p className="mt-4 text-lg text-slate-300">Create unique digital assets with automatic royalties on every resale</p>
        </div>
        
        {!isConnected ? (
          <div className="max-w-md mx-auto card p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-slate-400 mb-6">Connect your Stellar wallet to mint NFTs and set up royalties</p>
              <ConnectWalletButton size="lg" />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Preview Section */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
                <div className="card h-full flex flex-col">
                  <div className="relative pb-[100%] overflow-hidden rounded-lg mb-4">
                    <img
                      src={imagePreview || 'https://via.placeholder.com/400x400?text=NFT+Preview'}
                      alt="NFT Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4 flex-grow">
                    <h3 className="text-xl font-semibold text-white truncate">
                      {formData.name || 'Untitled NFT'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                      {formData.description || 'No description provided'}
                    </p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="text-lg font-medium text-white">{formData.price || '0'} XLM</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Royalty</p>
                        <p className="text-lg font-medium text-white">{formData.royaltyPercentage || '0'}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-slate-700">
                    <button
                      type="button"
                      onClick={handleGenerateRandomImage}
                      className="btn-secondary w-full"
                    >
                      Generate Random Image
                    </button>
                  </div>
                </div>
              </motion.div>
              
              {/* Form Section */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <form onSubmit={handleSubmit} className="card">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                        NFT Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter a name for your NFT"
                        className="input"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe your NFT"
                        className="input"
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-1">
                        Image URL (Optional)
                      </label>
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleImageUrlChange}
                        placeholder="Enter image URL or use random generator"
                        className="input"
                      />
                      <p className="mt-1 text-xs text-slate-500">Leave blank to use the randomly generated image</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-slate-300 mb-1">
                          Initial Price (XLM)
                        </label>
                        <input
                          type="text"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="e.g. 100"
                          className="input"
                        />
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-400">{errors.price}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="royaltyPercentage" className="block text-sm font-medium text-slate-300 mb-1">
                          Royalty Percentage
                        </label>
                        <input
                          type="text"
                          id="royaltyPercentage"
                          name="royaltyPercentage"
                          value={formData.royaltyPercentage}
                          onChange={handleChange}
                          placeholder="e.g. 10"
                          className="input"
                        />
                        {errors.royaltyPercentage && (
                          <p className="mt-1 text-sm text-red-400">{errors.royaltyPercentage}</p>
                        )}
                      </div>
                    </div>
                    
                    {errors.submit && (
                      <div className="bg-red-500/20 px-4 py-3 rounded-lg">
                        <p className="text-sm text-red-400">{errors.submit}</p>
                      </div>
                    )}
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full flex justify-center items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Minting...
                          </>
                        ) : (
                          'Mint NFT'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MintPage; 