import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import MintPage from './pages/MintPage';
import GalleryPage from './pages/GalleryPage';
import NFTDetailPage from './pages/NFTDetailPage';
import ProfilePage from './pages/ProfilePage';

// Context
import { WalletProvider } from './context/WalletContext';
import { DataModeProvider } from './context/DataModeContext';

function App() {
  return (
    <DataModeProvider>
      <WalletProvider>
        <div className="flex flex-col min-h-screen bg-slate-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/mint" element={<MintPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/nft/:id" element={<NFTDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WalletProvider>
    </DataModeProvider>
  );
}

export default App; 