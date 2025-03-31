# Celestium: NFT Platform with Royalty Distribution

Celestium is a modern platform for creators to mint NFTs with automated royalty distributions using Stellar's Soroban smart contracts.

## 🚀 Features

- **Connect Stellar Wallets**: Seamlessly connect to Stellar wallets like Freighter
- **Mint NFTs**: Create NFTs with customizable royalty percentages
- **Browse Gallery**: Explore NFTs in a beautifully designed gallery 
- **View NFT Details**: See comprehensive information about each NFT
- **Buy NFTs**: Purchase NFTs with automatic royalty distribution to creators
- **User Profiles**: Access your profile with owned and created NFTs
- **Demo Mode**: Toggle between demo mode (with mock data) and real blockchain interaction

## 🔧 Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/celestium.git
   cd celestium
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application will open in your browser at `http://localhost:3000`

## 🏗️ Smart Contracts

Celestium uses Soroban smart contracts to handle NFT minting and royalty distribution:

- Location: `contracts/celestium-nft/`
- Main contract: `contracts/celestium-nft/src/lib.rs`

### Smart Contract Features:

- NFT minting with metadata (name, description, image URL)
- Configurable royalty percentages (0-100%)
- Automatic royalty distribution on sales
- Ownership tracking and transfer mechanisms
- Query functions for NFT details and collections

## 📱 Frontend Application

The frontend is built with:

- **React**: Frontend framework
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Stellar SDK**: Blockchain interaction

### Key Components:

- **Wallet Connection**: Connect to Stellar wallets
- **NFT Minting Interface**: Create new NFTs with customizable properties
- **Gallery**: Browse and filter available NFTs
- **NFT Detail Page**: View comprehensive information about each NFT
- **Profile Page**: See your owned and created NFTs
- **Purchase Interface**: Buy NFTs with automatic royalty distribution

## 🚀 Usage

### Toggle Demo Mode

Switch between demo mode and real blockchain interaction using the toggle on the home page:

- **Demo Mode**: Uses mock data to demonstrate functionality
- **Real Mode**: Interacts with the actual Stellar network

### Connecting a Wallet

1. Click "Connect Wallet" in the navigation bar
2. Choose your wallet provider (Freighter recommended)
3. Approve the connection request

### Minting an NFT

1. Navigate to the "Create" page
2. Fill in the NFT details (name, description, image)
3. Set your desired royalty percentage (0-100%)
4. Click "Mint NFT"
5. Approve the transaction in your wallet

### Purchasing an NFT

1. Browse the gallery or search for specific NFTs
2. Click on an NFT to view details
3. Click "Buy Now"
4. Confirm the purchase price
5. Approve the transaction in your wallet
6. The payment will be automatically split between the seller and creator based on the royalty percentage

## 🧪 Testing

Run tests with:
```
npm test
```

## 📡 Network Configuration

The application currently connects to:

- **Default**: Stellar Testnet
- **Contract ID**: Will be updated after deployment

## 🔮 Future Development

- Implement support for additional wallets (Albedo, Rabet, etc.)
- Add advanced filtering and search in the gallery
- Implement NFT collections and categories
- Add auction functionality
- Support for multiple file types (audio, video, 3D models)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👥 Authors

- Jintu Kumar Das
- Sonali Thakur

---

Built with ❤️ for the Stellar ecosystem. 