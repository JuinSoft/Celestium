import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatPublicKey, formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';

function NFTCard({ nft }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative pb-[100%] overflow-hidden rounded-lg">
        <img
          src={nft.imageUrl}
          alt={nft.name}
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <Link to={`/nft/${nft.id}`}>
          <h3 className="text-lg font-semibold text-white hover:text-celestial-pink transition-colors duration-300 truncate">
            {nft.name}
          </h3>
        </Link>
        
        <p className="mt-1 text-sm text-slate-400 line-clamp-2">
          {nft.description}
        </p>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500">Creator</p>
            <p className="text-sm text-slate-300">{formatPublicKey(nft.creator)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Price</p>
            <p className="text-lg font-medium text-white">{formatPrice(nft.price)}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
          <div className="text-xs text-slate-400">
            Royalty: {nft.royaltyPercentage}%
          </div>
          <Link 
            to={`/nft/${nft.id}`}
            className="btn-primary py-1 px-4 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default NFTCard;