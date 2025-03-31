import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-celestial-blue via-celestial-purple to-stellar-yellow bg-clip-text text-transparent">Celestium</span>
            </Link>
            <p className="mt-2 text-sm text-slate-400">
              Empowering creators with automated royalties on Stellar's blockchain.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://developers.stellar.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white">
                  Stellar Developers
                </a>
              </li>
              <li>
                <a href="https://soroban.stellar.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white">
                  Soroban Smart Contracts
                </a>
              </li>
              <li>
                <a href="https://laboratory.stellar.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white">
                  Stellar Laboratory
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
              Connect
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://discord.gg/stellar" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white">
                  Discord
                </a>
              </li>
              <li>
                <a href="https://twitter.com/StellarOrg" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com/stellar" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-700">
          <p className="text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Celestium. Built on <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">Stellar</a>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 