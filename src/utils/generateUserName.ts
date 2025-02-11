const adjectives = [
    'Crypto', 'Based', 'Defi', 'Degen', 'Alpha', 'Based', 'Diamond', 'Eth',
    'Smart', 'Chain', 'Dao', 'Anon', 'Meta', 'Nft', 'Proof', 'Stake',
    'Token', 'Block', 'Hash', 'Mint'
];

const nouns = [
    'Whale', 'Degen', 'Trader', 'Holder', 'Miner', 'Staker', 'Builder',
    'Wizard', 'Punk', 'Pepe', 'Wojak', 'Dex', 'Fren', 'Ser', 'Defi',
    'Gwei', 'Chad', 'Hodler', 'Dapp'
];

export const generateUserName = (walletAddress: string): string => {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const addressSlice = walletAddress.slice(-4);


    return `${randomAdjective}${randomNoun}${addressSlice}`;
};