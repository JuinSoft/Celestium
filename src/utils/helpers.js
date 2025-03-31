// Format a public key to display a shortened version
export function formatPublicKey(publicKey, startChars = 4, endChars = 4) {
  if (!publicKey) return '';
  return `${publicKey.substring(0, startChars)}...${publicKey.substring(publicKey.length - endChars)}`;
}

// Format a number as a price with the given currency symbol
export function formatPrice(price, currency = 'XLM') {
  if (!price) return `0 ${currency}`;
  
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) return `0 ${currency}`;
  
  return `${parsedPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 7 })} ${currency}`;
}

// Format a date string to a readable format
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Calculate royalty amount based on price and percentage
export function calculateRoyalty(price, percentage) {
  if (!price || !percentage) return 0;
  
  const parsedPrice = parseFloat(price);
  const parsedPercentage = parseFloat(percentage);
  
  if (isNaN(parsedPrice) || isNaN(parsedPercentage)) return 0;
  
  return (parsedPrice * parsedPercentage) / 100;
}

// Generate a random placeholder image URL with a space theme
export function getSpaceImageUrl(seed) {
  const themes = [
    'galaxy',
    'nebula',
    'stars',
    'planet',
    'space',
    'cosmic'
  ];
  
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  const width = 800;
  const height = 800;
  
  return `https://source.unsplash.com/${width}x${height}/?${randomTheme}${seed ? `&sig=${seed}` : ''}`;
}

// Validate form data for NFT minting
export function validateNFTForm(data) {
  const errors = {};
  
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!data.description || data.description.trim() === '') {
    errors.description = 'Description is required';
  }
  
  if (!data.royaltyPercentage) {
    errors.royaltyPercentage = 'Royalty percentage is required';
  } else if (isNaN(parseFloat(data.royaltyPercentage))) {
    errors.royaltyPercentage = 'Royalty percentage must be a number';
  } else if (parseFloat(data.royaltyPercentage) < 0 || parseFloat(data.royaltyPercentage) > 100) {
    errors.royaltyPercentage = 'Royalty percentage must be between 0 and 100';
  }
  
  if (!data.price) {
    errors.price = 'Price is required';
  } else if (isNaN(parseFloat(data.price))) {
    errors.price = 'Price must be a number';
  } else if (parseFloat(data.price) <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
} 