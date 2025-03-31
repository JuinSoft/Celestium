import StellarSdk from '@stellar/stellar-sdk';

// Define network constants
const NETWORK = 'TESTNET'; // or 'PUBLIC' for mainnet
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET; // or StellarSdk.Networks.PUBLIC for mainnet
const HORIZON_URL = 'https://horizon-testnet.stellar.org'; // or 'https://horizon.stellar.org' for mainnet

// Initialize Stellar Server
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

// Contract ID (placeholder - this would be the actual deployed contract ID)
const NFT_CONTRACT_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

// Function to check if we're in demo mode
const checkDemoMode = () => {
  // Access localStorage directly since we can't use React hooks in a non-component file
  return localStorage.getItem('celestium-demo-mode') !== 'false';
};

// Create account
export async function createAccount(destination) {
  if (checkDemoMode()) {
    // Mock response for demo mode
    return { 
      successful: true, 
      account_id: destination
    };
  }

  try {
    // Using Friendbot to fund a testnet account
    const response = await fetch(`https://friendbot.stellar.org?addr=${destination}`);
    return await response.json();
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

// Load account details
export async function loadAccount(publicKey) {
  if (checkDemoMode()) {
    // Mock response for demo mode
    return {
      id: publicKey,
      sequence: '103720918424567',
      balances: [
        {
          asset_type: 'native',
          balance: '1000.0000000'
        }
      ]
    };
  }

  try {
    return await server.loadAccount(publicKey);
  } catch (error) {
    console.error('Error loading account:', error);
    throw error;
  }
}

// Get account balance
export async function getAccountBalance(publicKey) {
  if (checkDemoMode()) {
    // Mock response for demo mode
    return [
      {
        asset_type: 'native',
        balance: '1000.0000000'
      }
    ];
  }

  try {
    const account = await server.loadAccount(publicKey);
    return account.balances;
  } catch (error) {
    console.error('Error getting account balance:', error);
    throw error;
  }
}

// Submit transaction
export async function submitTransaction(signedTransaction) {
  if (checkDemoMode()) {
    // Mock response for demo mode
    return { 
      successful: true,
      hash: 'mock_transaction_hash_' + Date.now()
    };
  }

  try {
    const transactionResult = await server.submitTransaction(signedTransaction);
    return transactionResult;
  } catch (error) {
    console.error('Error submitting transaction:', error);
    // Extract more detailed error information
    if (error.response && error.response.data && error.response.data.extras) {
      throw new Error(JSON.stringify(error.response.data.extras));
    }
    throw error;
  }
}

// Mint NFT
export async function mintNFT(sourceKeypair, metadata, royaltyPercentage, royaltyRecipient) {
  if (checkDemoMode()) {
    // Mock response for demo mode
    return {
      successful: true,
      hash: 'mock_mint_hash_' + Date.now(),
      nft: {
        id: Date.now().toString(),
        name: metadata.name,
        description: metadata.description,
        imageUrl: metadata.imageUrl,
        creator: sourceKeypair.publicKey(),
        owner: sourceKeypair.publicKey(),
        royaltyPercentage,
        price: '100',
        createdAt: new Date().toISOString()
      }
    };
  }

  try {
    // This is a real implementation using Soroban contract
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    
    // Build a transaction that calls a Soroban contract to mint an NFT
    // Create the contract instance
    const contract = new StellarSdk.Contract(NFT_CONTRACT_ID);
    
    // Build the transaction with the mint function call
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "mint", // contract function to call
          // parameters to the mint function
          StellarSdk.xdr.ScVal.scvString(metadata.name),
          StellarSdk.xdr.ScVal.scvString(metadata.description),
          StellarSdk.xdr.ScVal.scvString(metadata.imageUrl),
          StellarSdk.xdr.ScVal.scvI32(parseInt(royaltyPercentage)),
          StellarSdk.StrKey.encodeEd25519PublicKey(royaltyRecipient || sourceKeypair.publicKey())
        )
      )
      .setTimeout(30)
      .build();
    
    // Sign the transaction
    transaction.sign(sourceKeypair);
    
    // Submit the transaction
    return await submitTransaction(transaction);
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
}

// Get NFTs owned by an account
export async function getNFTsForAccount(publicKey) {
  if (checkDemoMode()) {
    // Generate mock data for demo mode
    return generateMockNFTs(publicKey);
  }

  try {
    // Real implementation would query the Soroban contract
    const contract = new StellarSdk.Contract(NFT_CONTRACT_ID);
    
    // Prepare the transaction to call the contract's getNFTsByOwner function
    const account = await server.loadAccount(publicKey);
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "getNFTsByOwner",
          StellarSdk.StrKey.encodeEd25519PublicKey(publicKey)
        )
      )
      .setTimeout(30)
      .build();
    
    // We don't actually submit this transaction - we simulate it
    const response = await server.simulateTransaction(tx);
    
    // Parse the result from the contract call
    const resultValue = response.result.retval;
    // Process the returned data from the contract (would depend on the contract's implementation)
    // This is a placeholder implementation
    const nfts = []; // Parse resultValue to get the NFTs
    
    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    // In case of error, return mock data even in real mode for demo purposes
    return generateMockNFTs(publicKey);
  }
}

// Transfer NFT
export async function transferNFT(sourceKeypair, destinationPublicKey, nftId, amount) {
  if (checkDemoMode()) {
    // Mock response for demo mode
    return {
      successful: true,
      hash: 'mock_transfer_hash_' + Date.now()
    };
  }

  try {
    // Real implementation with Soroban contract
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    
    // Create the contract instance
    const contract = new StellarSdk.Contract(NFT_CONTRACT_ID);
    
    // Build the transaction with the transfer function call
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "transfer", // contract function to call
          // parameters to the transfer function
          StellarSdk.xdr.ScVal.scvString(nftId),
          StellarSdk.StrKey.encodeEd25519PublicKey(destinationPublicKey),
          StellarSdk.xdr.ScVal.scvI128(new StellarSdk.ScInt(amount).toI128())
        )
      )
      .setTimeout(30)
      .build();
    
    // Sign the transaction
    transaction.sign(sourceKeypair);
    
    // Submit the transaction
    return await submitTransaction(transaction);
  } catch (error) {
    console.error('Error transferring NFT:', error);
    throw error;
  }
}

// Helper function to generate mock NFTs for demo mode
function generateMockNFTs(publicKey) {
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
      imageUrl: `https://source.unsplash.com/800x800/?space,galaxy,cosmic&sig=${i}`,
      creator: creator,
      owner: isOwnedByUser ? creator : mockCreators[(i + 1) % mockCreators.length],
      royaltyPercentage: 5 + (i % 6), // 5-10%
      price: (50 + i * 10).toString(),
      createdAt: new Date(Date.now() - i * 86400000).toISOString() // Staggered creation dates
    };
  });
} 