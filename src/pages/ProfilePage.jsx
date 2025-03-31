import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import ConnectWalletButton from '../components/ConnectWalletButton';
import NFTCard from '../components/NFTCard';
import { formatPublicKey, formatPrice } from '../utils/helpers';
import { getAccountBalance, getNFTsForAccount } from '../services/stellarService';

function ProfilePage() {
  const navigate = useNavigate();
  const { isConnected, publicKey, disconnectWallet } = useWallet();
  
  const [nfts, setNfts] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created'); // 'created', 'collected', 'activity'
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isConnected) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // In a real implementation, these would fetch real data from the blockchain
        // For demo purposes, we'll use mock data
        
        // Fetch mock NFTs
        const mockNFTs = await getNFTsForAccount(publicKey);
        setNfts(mockNFTs);
        
        // Mock account balance
        setBalances([
          { asset_type: 'native', balance: '1000.0000000' }
        ]);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [isConnected, publicKey]);
  
  const createdNFTs = nfts.filter(nft => nft.creator === publicKey);
  const collectedNFTs = nfts.filter(nft => nft.owner === publicKey && nft.creator !== publicKey);
  
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full py-12 px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Connect Your Wallet</h2>
          <p className="text-slate-300 mb-8">
            Connect your Stellar wallet to view your profile, NFTs, and transaction history.
          </p>
          <ConnectWalletButton size="lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-gradient-stellar rounded-full mr-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {publicKey ? publicKey.substring(0, 1) : '?'}
                  </span>
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {formatPublicKey(publicKey, 6, 6)}
                  </h1>
                  <button 
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                    onClick={() => navigator.clipboard.writeText(publicKey)}
                  >
                    Copy Address
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Link to="/mint" className="btn-primary">
                  Mint New NFT
                </Link>
                <button 
                  onClick={disconnectWallet}
                  className="btn-secondary"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="card bg-slate-800/70">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-slate-400">Balance</h3>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {loading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : balances.length > 0 ? (
                      formatPrice(balances[0].balance)
                    ) : (
                      '0 XLM'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="card bg-slate-800/70">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-slate-400">Created</h3>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {loading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      `${createdNFTs.length} NFTs`
                    )}
                  </p>
                </div>
              </div>
              
              <div className="card bg-slate-800/70">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-slate-400">Collected</h3>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {loading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      `${collectedNFTs.length} NFTs`
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'created'
                  ? 'text-celestial-indigo border-b-2 border-celestial-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Created
            </button>
            <button
              onClick={() => setActiveTab('collected')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'collected'
                  ? 'text-celestial-indigo border-b-2 border-celestial-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Collected
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'activity'
                  ? 'text-celestial-indigo border-b-2 border-celestial-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Activity
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-celestial-purple"></div>
          </div>
        ) : (
          <>
            {activeTab === 'created' && (
              <div>
                {createdNFTs.length === 0 ? (
                  <div className="text-center py-16">
                    <h2 className="text-xl font-semibold text-white mb-4">No Created NFTs Found</h2>
                    <p className="text-slate-400 mb-8">
                      You haven't created any NFTs yet. Start minting your digital content as NFTs.
                    </p>
                    <Link to="/mint" className="btn-primary">
                      Mint Your First NFT
                    </Link>
                  </div>
                ) : (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {createdNFTs.map((nft) => (
                      <motion.div
                        key={nft.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                      >
                        <NFTCard nft={nft} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
            
            {activeTab === 'collected' && (
              <div>
                {collectedNFTs.length === 0 ? (
                  <div className="text-center py-16">
                    <h2 className="text-xl font-semibold text-white mb-4">No Collected NFTs Found</h2>
                    <p className="text-slate-400 mb-8">
                      You haven't collected any NFTs yet. Explore the gallery to find unique digital collectibles.
                    </p>
                    <Link to="/gallery" className="btn-primary">
                      Explore Gallery
                    </Link>
                  </div>
                ) : (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {collectedNFTs.map((nft) => (
                      <motion.div
                        key={nft.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                      >
                        <NFTCard nft={nft} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
            
            {activeTab === 'activity' && (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Event</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">NFT</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">From/To</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-800/50 divide-y divide-slate-700">
                      {nfts.length > 0 ? (
                        nfts.map((nft) => (
                          <tr key={nft.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {nft.creator === publicKey ? 'Created' : 'Purchased'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              <Link to={`/nft/${nft.id}`} className="hover:text-celestial-pink">
                                {nft.name}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {nft.creator === publicKey ? '-' : formatPrice(nft.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                              {nft.creator === publicKey 
                                ? 'You created this NFT' 
                                : `Purchased from ${formatPublicKey(nft.creator)}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                              {new Date(nft.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                            No activity found. Start creating or collecting NFTs to see your activity.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage; 