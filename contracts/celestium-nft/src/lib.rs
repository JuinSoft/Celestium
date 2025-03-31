#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Bytes, BytesN, Env, Map, String, Symbol, Vec, 
};

// NFT Token struct to store metadata and royalty information
#[contracttype]
pub struct NFT {
    id: String,
    name: String,
    description: String,
    image_url: String,
    creator: Address,
    owner: Address,
    royalty_percentage: u32,
    price: i128,
    created_at: u64,
}

// The contract state
#[contracttype]
pub enum DataKey {
    Admin,
    NFTCounter,
    NFT(String),
    OwnerNFTs(Address),
    CreatorNFTs(Address),
}

// The main contract
#[contract]
pub struct CelestiumNFT;

#[contractimpl]
impl CelestiumNFT {
    // Initialize the contract with an admin address
    pub fn initialize(env: Env, admin: Address) -> () {
        admin.require_auth();
        
        // Check if already initialized
        if let Some(_) = env.storage().instance().get::<_, Address>(&DataKey::Admin) {
            panic!("Contract already initialized");
        }
        
        // Set the admin address and initialize NFT counter
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::NFTCounter, &0u32);
    }
    
    // Mint a new NFT
    pub fn mint(
        env: Env,
        name: String,
        description: String,
        image_url: String,
        royalty_percentage: u32,
        creator: Address,
    ) -> String {
        // Require authorization from the creator
        creator.require_auth();
        
        // Validate royalty percentage (0-100)
        if royalty_percentage > 100 {
            panic!("Royalty percentage must be between 0 and 100");
        }
        
        // Get and increment the NFT counter
        let mut nft_counter = env.storage().instance().get::<_, u32>(&DataKey::NFTCounter).unwrap_or(0);
        nft_counter += 1;
        
        // Create NFT ID
        let nft_id = String::from_str(&env, &format!("NFT{}", nft_counter));
        
        // Create NFT object
        let nft = NFT {
            id: nft_id.clone(),
            name,
            description,
            image_url,
            creator: creator.clone(),
            owner: creator.clone(),
            royalty_percentage,
            price: 100_0000000, // Default price in stroops (0.01 XLM)
            created_at: env.ledger().timestamp(),
        };
        
        // Store the NFT
        env.storage().instance().set(&DataKey::NFT(nft_id.clone()), &nft);
        
        // Update the owner's NFT list
        self.add_nft_to_owner(&env, &creator, &nft_id);
        
        // Update the creator's NFT list
        self.add_nft_to_creator(&env, &creator, &nft_id);
        
        // Update the counter
        env.storage().instance().set(&DataKey::NFTCounter, &nft_counter);
        
        nft_id
    }
    
    // Helper function to add NFT to owner's list
    fn add_nft_to_owner(self, env: &Env, owner: &Address, nft_id: &String) {
        let key = DataKey::OwnerNFTs(owner.clone());
        let mut owner_nfts: Vec<String> = env.storage().instance().get(&key).unwrap_or(Vec::new(env));
        owner_nfts.push_back(nft_id.clone());
        env.storage().instance().set(&key, &owner_nfts);
    }
    
    // Helper function to add NFT to creator's list
    fn add_nft_to_creator(self, env: &Env, creator: &Address, nft_id: &String) {
        let key = DataKey::CreatorNFTs(creator.clone());
        let mut creator_nfts: Vec<String> = env.storage().instance().get(&key).unwrap_or(Vec::new(env));
        creator_nfts.push_back(nft_id.clone());
        env.storage().instance().set(&key, &creator_nfts);
    }
    
    // Helper function to remove NFT from owner's list
    fn remove_nft_from_owner(self, env: &Env, owner: &Address, nft_id: &String) {
        let key = DataKey::OwnerNFTs(owner.clone());
        if let Some(mut owner_nfts) = env.storage().instance().get::<_, Vec<String>>(&key) {
            let mut index = 0;
            let mut found = false;
            
            for (i, id) in owner_nfts.iter().enumerate() {
                if id == nft_id {
                    index = i;
                    found = true;
                    break;
                }
            }
            
            if found {
                owner_nfts.remove(index);
                env.storage().instance().set(&key, &owner_nfts);
            }
        }
    }
    
    // Transfer an NFT to a new owner with payment and royalty distribution
    pub fn transfer(
        env: Env,
        nft_id: String,
        to: Address,
        amount: i128,
    ) -> () {
        // Get the NFT
        let mut nft = env.storage().instance().get::<_, NFT>(&DataKey::NFT(nft_id.clone())).unwrap();
        
        // Require authorization from the current owner
        nft.owner.require_auth();
        
        // Validate that the amount matches the NFT price
        if amount < nft.price {
            panic!("Payment amount is less than NFT price");
        }
        
        // Process payment with royalties
        self.process_payment(&env, &nft, &to, amount);
        
        // Update ownership
        let prev_owner = nft.owner.clone();
        nft.owner = to.clone();
        
        // Update the NFT
        env.storage().instance().set(&DataKey::NFT(nft_id.clone()), &nft);
        
        // Update owner lists
        self.remove_nft_from_owner(&env, &prev_owner, &nft_id);
        self.add_nft_to_owner(&env, &to, &nft_id);
    }
    
    // Helper function to process payment with royalties
    fn process_payment(self, env: &Env, nft: &NFT, buyer: &Address, amount: i128) {
        // Get the native token contract
        let token_client = token::Client::new(env, &token::Interface::Stellar);
        
        // Calculate royalty amount
        let royalty_amount = (amount * nft.royalty_percentage as i128) / 100;
        let seller_amount = amount - royalty_amount;
        
        // Transfer payment from buyer to seller
        token_client.transfer(
            buyer,
            &nft.owner,
            &seller_amount,
        );
        
        // Transfer royalty to creator if applicable
        if royalty_amount > 0 {
            token_client.transfer(
                buyer,
                &nft.creator,
                &royalty_amount,
            );
        }
    }
    
    // Set price for an NFT
    pub fn set_price(env: Env, nft_id: String, price: i128) -> () {
        // Get the NFT
        let mut nft = env.storage().instance().get::<_, NFT>(&DataKey::NFT(nft_id.clone())).unwrap();
        
        // Require authorization from the current owner
        nft.owner.require_auth();
        
        // Update the price
        nft.price = price;
        
        // Update the NFT
        env.storage().instance().set(&DataKey::NFT(nft_id), &nft);
    }
    
    // Get NFT details
    pub fn get_nft(env: Env, nft_id: String) -> NFT {
        env.storage().instance().get::<_, NFT>(&DataKey::NFT(nft_id)).unwrap()
    }
    
    // Get NFTs owned by an address
    pub fn get_nfts_by_owner(env: Env, owner: Address) -> Vec<NFT> {
        let nft_ids = env.storage().instance().get::<_, Vec<String>>(&DataKey::OwnerNFTs(owner))
            .unwrap_or(Vec::new(&env));
            
        let mut nfts = Vec::new(&env);
        for id in nft_ids.iter() {
            if let Some(nft) = env.storage().instance().get::<_, NFT>(&DataKey::NFT(id.clone())) {
                nfts.push_back(nft);
            }
        }
        
        nfts
    }
    
    // Get NFTs created by an address
    pub fn get_nfts_by_creator(env: Env, creator: Address) -> Vec<NFT> {
        let nft_ids = env.storage().instance().get::<_, Vec<String>>(&DataKey::CreatorNFTs(creator))
            .unwrap_or(Vec::new(&env));
            
        let mut nfts = Vec::new(&env);
        for id in nft_ids.iter() {
            if let Some(nft) = env.storage().instance().get::<_, NFT>(&DataKey::NFT(id.clone())) {
                nfts.push_back(nft);
            }
        }
        
        nfts
    }
    
    // Get all NFTs (limited to prevent excessive gas usage)
    pub fn get_all_nfts(env: Env, limit: u32, offset: u32) -> Vec<NFT> {
        let nft_counter = env.storage().instance().get::<_, u32>(&DataKey::NFTCounter).unwrap_or(0);
        let mut nfts = Vec::new(&env);
        
        let start = offset.min(nft_counter);
        let end = (offset + limit).min(nft_counter);
        
        for i in start..end {
            let nft_id = String::from_str(&env, &format!("NFT{}", i + 1));
            if let Some(nft) = env.storage().instance().get::<_, NFT>(&DataKey::NFT(nft_id)) {
                nfts.push_back(nft);
            }
        }
        
        nfts
    }
}

// Tests
#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::{Address as AddressTestTool, Ledger}, vec, Symbol};
    
    #[test]
    fn test_initialize_and_mint() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CelestiumNFT);
        let client = CelestiumNFTClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        
        // Initialize the contract
        client.initialize(&admin);
        
        // Mint an NFT
        env.mock_all_auths();
        let nft_id = client.mint(
            &String::from_str(&env, "Cosmic Journey"),
            &String::from_str(&env, "A mesmerizing voyage through the cosmos"),
            &String::from_str(&env, "https://example.com/image.jpg"),
            &10u32,
            &creator
        );
        
        // Get the NFT
        let nft = client.get_nft(&nft_id);
        assert_eq!(nft.name, String::from_str(&env, "Cosmic Journey"));
        assert_eq!(nft.royalty_percentage, 10u32);
        assert_eq!(nft.creator, creator);
        assert_eq!(nft.owner, creator);
    }
    
    #[test]
    fn test_transfer_with_royalties() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CelestiumNFT);
        let client = CelestiumNFTClient::new(&env, &contract_id);
        
        // Setup token contract for testing payments
        let token_admin = Address::generate(&env);
        let token_contract_id = env.register_stellar_asset_contract(token_admin.clone());
        
        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        let buyer = Address::generate(&env);
        
        // Fund accounts
        env.mock_all_auths();
        token::Client::new(&env, &token_contract_id).mint(&token_admin, &buyer, &1000_0000000);
        
        // Initialize the contract
        client.initialize(&admin);
        
        // Mint an NFT
        let nft_id = client.mint(
            &String::from_str(&env, "Cosmic Journey"),
            &String::from_str(&env, "A mesmerizing voyage through the cosmos"),
            &String::from_str(&env, "https://example.com/image.jpg"),
            &10u32, // 10% royalty
            &creator
        );
        
        // Get the NFT and verify price
        let nft = client.get_nft(&nft_id);
        assert_eq!(nft.price, 100_0000000); // 100 XLM in stroops
        
        // Transfer the NFT with payment
        client.transfer(&nft_id, &buyer, &nft.price);
        
        // Verify ownership change
        let updated_nft = client.get_nft(&nft_id);
        assert_eq!(updated_nft.owner, buyer);
        
        // Check the owner's NFT list
        let buyer_nfts = client.get_nfts_by_owner(&buyer);
        assert_eq!(buyer_nfts.len(), 1);
        assert_eq!(buyer_nfts.get(0).unwrap().id, nft_id);
        
        // Verify creator can still see the NFT in their created list
        let creator_nfts = client.get_nfts_by_creator(&creator);
        assert_eq!(creator_nfts.len(), 1);
        assert_eq!(creator_nfts.get(0).unwrap().id, nft_id);
    }
} 