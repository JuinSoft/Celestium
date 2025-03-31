import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NFTCard from '../components/NFTCard';
import { useWallet } from '../context/WalletContext';
import { getNFTsForAccount } from '../services/stellarService';
import { getSpaceImageUrl } from '../utils/helpers';

function GalleryPage() {
  const { isConnected, publicKey } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'mine', 'forSale'
  
  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        // For demo purposes, we'll generate some mock NFTs
        // In a real implementation, this would fetch NFTs from the blockchain
        const mockNFTs = generateMockNFTs();
        setNfts(mockNFTs);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNFTs();
  }, [publicKey]);
  
  const generateMockNFTs = () => {
    // Create some mock NFT data for the gallery
    const mockCreators = [
      'GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A',
      'GD7BPWSXZJ6VKQZLPVGIMDEIMJGBGQYNM3TGQVPZI7HFNL32ZOSVK7XQ',
      publicKey || 'GCEXAMPLE5HWNK4AYSTEQ4UWDKIB7QA5VWSEC7YICMN32AXU4KBAOV5JN'
    ];
    
    const nftNames = [
      'Cosmic Journey',
      'Digital Dreams',
      'Nebula Nexus',
      'Quantum Quasar',
      'Stellar Symphony',
      'Celestial Serenity',
      'Galactic Guardian',
      'Astral Ascent',
      'Interstellar Illusion',
      'Void Voyager',
      'Cosmic Consciousness',
      'Supernova Soul'
    ];
    
    const descriptions = [
      'A mesmerizing voyage through the cosmos',
      'An exploration of digital consciousness',
      'Where nebulae meet in cosmic harmony',
      'Quantum particles dance in the void',
      'The music of the spheres visualized',
      'Finding peace among the stars',
      'Protecting the boundaries of space-time',
      'Rising beyond mortal limitations',
      'What you see may not be reality',
      'Traversing the emptiness between worlds',
      'The universe becoming aware of itself',
      'The explosive beauty of stellar death'
    ];
    
    return Array.from({ length: 12 }, (_, i) => {
      const creator = mockCreators[i % mockCreators.length];
      const isOwnedByUser = creator === publicKey;
      
      return {
        id: (i + 1).toString(),
        name: nftNames[i],
        description: descriptions[i],
        imageUrl: getSpaceImageUrl(i.toString()),
        creator: creator,
        owner: isOwnedByUser ? creator : mockCreators[(i + 1) % mockCreators.length],
        royaltyPercentage: 5 + (i % 6), // 5-10%
        price: (50 + i * 10).toString(),
        createdAt: new Date(Date.now() - i * 86400000).toISOString() // Staggered creation dates
      };
    });
  };
  
  const filteredNFTs = nfts.filter(nft => {
    if (filter === 'all') return true;
    if (filter === 'mine' && isConnected) return nft.creator === publicKey || nft.owner === publicKey;
    if (filter === 'forSale') return nft.owner !== publicKey;
    return true;
  });
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white">NFT Gallery</h1>
          <p className="mt-4 text-lg text-slate-300">Discover unique digital collectibles with automated royalties</p>
        </div>
        
        {/* Filters */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-celestial-indigo text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All NFTs
            </button>
            <button
              onClick={() => setFilter('mine')}
              disabled={!isConnected}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                !isConnected
                  ? 'text-slate-500 cursor-not-allowed'
                  : filter === 'mine'
                  ? 'bg-celestial-indigo text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              My NFTs
            </button>
            <button
              onClick={() => setFilter('forSale')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'forSale'
                  ? 'bg-celestial-indigo text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              For Sale
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-celestial-purple"></div>
          </div>
        ) : filteredNFTs.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-white mb-4">No NFTs Found</h2>
            <p className="text-slate-400 mb-8">
              {filter === 'mine' ? 
                "You don't own any NFTs yet. Start creating your own digital collectibles!" :
                "No NFTs are available in this category right now. Check back later!"}
            </p>
            
            {filter === 'mine' && (
              <Link to="/mint" className="btn-primary">
                Mint Your First NFT
              </Link>
            )}
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
            {filteredNFTs.map((nft) => (
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
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="card max-w-3xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-semibold text-white mb-4">Create Your Own NFT</h2>
            <p className="text-slate-300 mb-6">
              Ready to join the creator economy? Mint your digital content as NFTs with automated royalties.
            </p>
            <Link to="/mint" className="btn-primary inline-block">
              Start Minting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryPage; 