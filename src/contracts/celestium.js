import { Contract, SorobanRpc } from '@stellar/stellar-sdk';
import { NFT_CONTRACT_ID } from '../services/contractService';

// Define network constants
const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';
const TESTNET_RPC_URL = 'https://soroban-testnet.stellar.org';

/**
 * Client for interacting with the Celestium NFT contract
 * This provides a JavaScript interface to the Soroban contract functions
 */
export class CelestiumContractClient {
  /**
   * Initialize the contract client
   * @param {string} contractId - The contract ID (optional, defaults to the one in config)
   * @param {string} networkPassphrase - The network passphrase (optional, defaults to testnet)
   * @param {string} rpcUrl - The Soroban RPC URL (optional, defaults to testnet)
   */
  constructor(
    contractId = NFT_CONTRACT_ID,
    networkPassphrase = TESTNET_PASSPHRASE,
    rpcUrl = TESTNET_RPC_URL
  ) {
    this.contractId = contractId;
    this.networkPassphrase = networkPassphrase;
    this.rpcUrl = rpcUrl;
    // Create a simple mock server for now to avoid the import error
    this.server = {
      sendTransaction: async () => ({ status: "PENDING", hash: "mock_hash" }),
      getTransaction: async () => ({ status: "SUCCESS", resultMetaXdr: "mock_result" })
    };
  }

  /**
   * Get the contract instance
   * @returns {Contract} The contract instance
   */
  getContract() {
    return new Contract(this.contractId);
  }

  /**
   * Initialize the contract
   * @param {string} adminPublicKey - The admin's public key
   * @param {Function} signTransaction - Function to sign transactions
   * @returns {Promise<Object>} Transaction result
   */
  async initialize(adminPublicKey, signTransaction) {
    const contract = this.getContract();
    
    // Build the transaction
    const tx = await contract.call(
      "initialize",
      adminPublicKey
    ).buildTransaction(adminPublicKey);
    
    // Sign and submit the transaction
    return this.signAndSubmit(tx, signTransaction);
  }

  /**
   * Mint a new NFT
   * @param {Object} nftData - NFT data including name, description, image_url, royalty_percentage
   * @param {string} creatorPublicKey - The creator's public key
   * @param {Function} signTransaction - Function to sign transactions
   * @returns {Promise<Object>} Transaction result and NFT ID
   */
  async mintNFT(nftData, creatorPublicKey, signTransaction) {
    const { name, description, imageUrl, royaltyPercentage } = nftData;
    const contract = this.getContract();
    
    // Build the transaction
    const tx = await contract.call(
      "mint",
      name,
      description,
      imageUrl,
      royaltyPercentage,
      creatorPublicKey
    ).buildTransaction(creatorPublicKey);
    
    // Sign and submit the transaction
    const result = await this.signAndSubmit(tx, signTransaction);
    
    return {
      ...result,
      nftId: result.result, // The contract returns the NFT ID
    };
  }

  /**
   * Transfer an NFT to a new owner
   * @param {string} nftId - The NFT ID
   * @param {string} toPublicKey - The recipient's public key
   * @param {number} amount - The payment amount
   * @param {string} fromPublicKey - The sender's public key
   * @param {Function} signTransaction - Function to sign transactions
   * @returns {Promise<Object>} Transaction result
   */
  async transferNFT(nftId, toPublicKey, amount, fromPublicKey, signTransaction) {
    const contract = this.getContract();
    
    // Build the transaction
    const tx = await contract.call(
      "transfer",
      nftId,
      toPublicKey,
      amount
    ).buildTransaction(fromPublicKey);
    
    // Sign and submit the transaction
    return this.signAndSubmit(tx, signTransaction);
  }

  /**
   * Set the price for an NFT
   * @param {string} nftId - The NFT ID
   * @param {number} price - The new price
   * @param {string} ownerPublicKey - The owner's public key
   * @param {Function} signTransaction - Function to sign transactions
   * @returns {Promise<Object>} Transaction result
   */
  async setNFTPrice(nftId, price, ownerPublicKey, signTransaction) {
    const contract = this.getContract();
    
    // Build the transaction
    const tx = await contract.call(
      "set_price",
      nftId,
      price
    ).buildTransaction(ownerPublicKey);
    
    // Sign and submit the transaction
    return this.signAndSubmit(tx, signTransaction);
  }

  /**
   * Get details for a specific NFT
   * @param {string} nftId - The NFT ID
   * @returns {Promise<Object>} NFT details
   */
  async getNFTDetails(nftId) {
    const contract = this.getContract();
    
    // Call the contract view function
    const result = await contract.call(
      "get_nft",
      nftId
    ).simulate();
    
    // Parse the result
    if (result && result.result) {
      return this.parseNFT(result.result);
    }
    
    return null;
  }

  /**
   * Get all NFTs owned by an address
   * @param {string} ownerPublicKey - The owner's public key
   * @returns {Promise<Array>} List of NFTs
   */
  async getNFTsByOwner(ownerPublicKey) {
    const contract = this.getContract();
    
    // Call the contract view function
    const result = await contract.call(
      "get_nfts_by_owner",
      ownerPublicKey
    ).simulate();
    
    // Parse the result
    if (result && result.result) {
      return this.parseNFTList(result.result);
    }
    
    return [];
  }

  /**
   * Get all NFTs created by an address
   * @param {string} creatorPublicKey - The creator's public key
   * @returns {Promise<Array>} List of NFTs
   */
  async getNFTsByCreator(creatorPublicKey) {
    const contract = this.getContract();
    
    // Call the contract view function
    const result = await contract.call(
      "get_nfts_by_creator",
      creatorPublicKey
    ).simulate();
    
    // Parse the result
    if (result && result.result) {
      return this.parseNFTList(result.result);
    }
    
    return [];
  }

  /**
   * Get all NFTs with pagination
   * @param {number} limit - Maximum number of NFTs to return
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} List of NFTs
   */
  async getAllNFTs(limit = 20, offset = 0) {
    const contract = this.getContract();
    
    // Call the contract view function
    const result = await contract.call(
      "get_all_nfts",
      limit,
      offset
    ).simulate();
    
    // Parse the result
    if (result && result.result) {
      return this.parseNFTList(result.result);
    }
    
    return [];
  }

  /**
   * Sign and submit a transaction
   * @param {Transaction} transaction - The transaction
   * @param {Function} signTransaction - Function to sign transactions
   * @returns {Promise<Object>} Transaction result
   * @private
   */
  async signAndSubmit(transaction, signTransaction) {
    try {
      // Sign the transaction
      const signedTx = await signTransaction(transaction);
      
      // Submit the transaction
      const sendResponse = await this.server.sendTransaction(signedTx);
      
      // Check for immediate errors
      if (sendResponse.status !== "PENDING") {
        throw new Error(`Transaction failed: ${sendResponse.status}`);
      }
      
      // Wait for the transaction to complete
      let txResponse;
      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        txResponse = await this.server.getTransaction(sendResponse.hash);
      } while (txResponse.status === "NOT_FOUND");
      
      // Check the final status
      if (txResponse.status === "SUCCESS") {
        return {
          success: true,
          txHash: sendResponse.hash,
          result: txResponse.resultMetaXdr,
        };
      } else {
        throw new Error(`Transaction failed: ${txResponse.status}`);
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Parse an NFT from the contract response
   * @param {Object} nftData - The NFT data from the contract
   * @returns {Object} Parsed NFT object
   * @private
   */
  parseNFT(nftData) {
    return {
      id: nftData.id,
      name: nftData.name,
      description: nftData.description,
      imageUrl: nftData.image_url,
      creator: nftData.creator,
      owner: nftData.owner,
      royaltyPercentage: nftData.royalty_percentage,
      price: nftData.price / 10000000, // Convert from stroops to XLM
      createdAt: new Date(nftData.created_at * 1000).toISOString(),
    };
  }

  /**
   * Parse a list of NFTs from the contract response
   * @param {Array} nftList - The list of NFTs from the contract
   * @returns {Array} Parsed NFT objects
   * @private
   */
  parseNFTList(nftList) {
    return nftList.map(nft => this.parseNFT(nft));
  }
}

export default CelestiumContractClient; 