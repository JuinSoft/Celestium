import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ConnectWalletButton from '../components/ConnectWalletButton';
import DataModeToggle from '../components/DataModeToggle';
import { useWallet } from '../context/WalletContext';
import { useDataMode } from '../context/DataModeContext';

function HomePage() {
  const { isConnected } = useWallet();
  const { isDemoMode } = useDataMode();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-celestial-indigo/90 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-white mb-2 sm:mb-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-celestial-purple text-white mr-2">
                  DEMO
                </span>
                You're using demo mode with mock data
              </p>
              <DataModeToggle />
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-celestial-blue/20 via-celestial-purple/10 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-6xl font-bold text-white leading-tight"
              >
                <span className="bg-gradient-to-r from-celestial-blue via-celestial-purple to-stellar-yellow bg-clip-text text-transparent">
                  Creators Earn More
                </span>
                <br />
                <span>with Automated Royalties</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto"
              >
                Celestium empowers creators with automated royalty distributions on the Stellar blockchain, ensuring fair compensation every time their NFTs are sold.
              </motion.p>
              
              <motion.div 
                variants={fadeIn}
                className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              >
                {isConnected ? (
                  <Link to="/mint" className="btn-primary text-lg py-3 px-8">
                    Mint Your First NFT
                  </Link>
                ) : (
                  <ConnectWalletButton size="lg" />
                )}
                <Link to="/gallery" className="btn-secondary text-lg py-3 px-8">
                  Explore Gallery
                </Link>
              </motion.div>
              
              {!isDemoMode && (
                <motion.div variants={fadeIn} className="mt-6 flex justify-center">
                  <DataModeToggle />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-celestial-blue/30 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-celestial-purple/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">How Celestium Works</h2>
            <p className="mt-4 text-lg text-slate-400">Simple, transparent, and creator-focused</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-celestial-blue/30 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-celestial-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Mint Your NFT</h3>
              <p className="mt-2 text-slate-400">Create and mint your digital content as an NFT with custom royalty settings.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-celestial-purple/30 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-celestial-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">List for Sale</h3>
              <p className="mt-2 text-slate-400">List your NFT in our marketplace for collectors to discover and purchase.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-stellar-yellow/30 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-stellar-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Earn Royalties</h3>
              <p className="mt-2 text-slate-400">Receive royalties automatically every time your NFT is resold on any marketplace.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Start Creating?</h2>
            <p className="mt-4 text-lg text-slate-300">Join the Celestium community today and start earning from your digital creations</p>
            
            <div className="mt-10">
              {isConnected ? (
                <Link to="/mint" className="btn-primary text-lg py-3 px-8">
                  Start Minting
                </Link>
              ) : (
                <ConnectWalletButton size="lg" />
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;