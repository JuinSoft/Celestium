import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import ConnectWalletButton from '../components/ConnectWalletButton';
import { formatPrice, formatPublicKey, formatDate, calculateRoyalty } from '../utils/helpers';
import { getNFTsForAccount } from '../services/stellarService';

function NFTDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isConnected, publicKey } = useWallet();
  
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  useEffect(() => {
    const fetchNFTDetails = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch the NFT details from the blockchain
        // For demo purposes, we'll use mock data
        const mockNFTs = await getNFTsForAccount('');
        const foundNFT = mockNFTs.find(nft => nft.id === id);
        
        if (foundNFT) {
          setNft(foundNFT);
        } else {
          setError('NFT not found');
        }
      } catch (error) {
        console.error('Error fetching NFT details:', error);
        setError('Error loading NFT details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNFTDetails();
  }, [id]);
  
  const handlePurchase = async () => {
    if (!isConnected) {
      return;
    }
    
    setPurchasing(true);
    
    try {
      // In a real implementation, this would call the transferNFT function from stellarService
      // For demo purposes, we'll simulate a successful purchase
      
      // Simulate a delay for the purchase process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set success and update the NFT ownership
      setPurchaseSuccess(true);
      setNft({
        ...nft,
        owner: publicKey
      });
      
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      setError('Failed to purchase NFT. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-celestial-purple"></div>
      </div>
    );
  }
  
  if (error || !nft) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-lg w-full text-center py-16">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">NFT Not Found</h2>
          <p className="text-slate-300 mb-8">The NFT you are looking for does not exist or could not be loaded.</p>
          <button
            onClick={() => navigate('/gallery')}
            className="btn-primary"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }
  
  const isOwner = isConnected && publicKey === nft.owner;
  const isCreator = isConnected && publicKey === nft.creator;
  const royaltyAmount = calculateRoyalty(nft.price, nft.royaltyPercentage);
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* NFT Image */}
          <div className="card overflow-hidden">
            <div className="relative pb-[100%]">
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* NFT Details */}
          <div className="card flex flex-col">
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-white">{nft.name}</h1>
              
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm text-slate-400">Created by</span>
                <span className="text-sm font-medium text-white">
                  {isCreator ? 'You' : formatPublicKey(nft.creator)}
                </span>
                {isCreator && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-celestial-purple/20 text-celestial-purple">
                    Creator
                  </span>
                )}
              </div>
              
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-slate-400">Owned by</span>
                <span className="text-sm font-medium text-white">
                  {isOwner ? 'You' : formatPublicKey(nft.owner)}
                </span>
                {isOwner && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-celestial-blue/20 text-celestial-blue">
                    Owner
                  </span>
                )}
              </div>
              
              <p className="mt-6 text-slate-300">
                {nft.description}
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="card bg-slate-800/70">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-slate-400">Price</h3>
                    <p className="mt-1 text-2xl font-semibold text-white">{formatPrice(nft.price)}</p>
                  </div>
                </div>
                
                <div className="card bg-slate-800/70">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-slate-400">Royalty</h3>
                    <p className="mt-1 text-2xl font-semibold text-white">{nft.royaltyPercentage}%</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatPrice(royaltyAmount)} per sale
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Created</span>
                  <span className="text-sm text-white">{formatDate(nft.createdAt)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Token ID</span>
                  <span className="text-sm text-white">{nft.id}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-700">
              {!isConnected ? (
                <div className="text-center">
                  <p className="mb-4 text-slate-300">Connect your wallet to purchase this NFT</p>
                  <ConnectWalletButton />
                </div>
              ) : isOwner ? (
                <div className="bg-slate-800/70 rounded-lg p-4 text-center">
                  <p className="text-white font-medium">You own this NFT</p>
                </div>
              ) : purchaseSuccess ? (
                <div className="bg-green-500/20 rounded-lg p-4 text-center">
                  <p className="text-green-400 font-medium">Purchase successful! You now own this NFT.</p>
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="btn-primary w-full py-3 flex justify-center items-center"
                >
                  {purchasing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Buy for {formatPrice(nft.price)}
                    </>
                  )}
                </button>
              )}
              
              <div className="mt-4 text-xs text-center text-slate-400">
                {!isOwner && !purchaseSuccess && (
                  <p>
                    {isCreator 
                      ? `You'll receive ${formatPrice(royaltyAmount)} (${nft.royaltyPercentage}%) as creator royalties.` 
                      : `${formatPrice(royaltyAmount)} (${nft.royaltyPercentage}%) will go to the original creator.`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Transaction History (Placeholder) */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-6">Transaction History</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Event</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">From</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">To</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/50 divide-y divide-slate-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Minted</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatPublicKey(nft.creator)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDate(nft.createdAt)}</td>
                  </tr>
                  {purchaseSuccess && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Purchase</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{formatPrice(nft.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatPublicKey(nft.owner)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatPublicKey(publicKey)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDate(new Date().toISOString())}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTDetailPage; 