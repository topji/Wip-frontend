/**
 * Generates a unique Dicebear avatar for IP hash certificates
 * @param title - The certificate title/description used as seed for generating the avatar
 * @param size - The size of the avatar (default: 200)
 * @returns The Dicebear API URL for the generated avatar
 */
export const generateCertificateAvatar = (title: string, size: number = 200): string => {
  const baseUrl = 'https://api.dicebear.com/7.x/identicon/svg';
  const backgroundColor = '00acc1,039be5,3f51b5,8e24aa,e91e63,ff5722,ff9800,ffc107,4caf50,8bc34a';
  
  // Use title as seed, fallback to default if empty
  const seed = title && title.trim() ? encodeURIComponent(title.trim()) : 'default-certificate';
  
  return `${baseUrl}?seed=${seed}&size=${size}&backgroundColor=${backgroundColor}`;
};

/**
 * Generates a pixel-art avatar for user profiles
 * @param name - The user's name used as seed for generating the avatar
 * @param size - The size of the avatar (default: 200)
 * @returns The Dicebear API URL for the generated pixel-art avatar
 */
export const generateProfileAvatar = (name: string, size: number = 200): string => {
  const baseUrl = 'https://api.dicebear.com/7.x/pixel-art/svg';
  const backgroundColor = '00acc1,039be5,3f51b5,8e24aa,e91e63,ff5722,ff9800,ffc107,4caf50,8bc34a';
  
  // Use name as seed, fallback to default if empty
  const seed = name && name.trim() ? encodeURIComponent(name.trim()) : 'default-profile';
  
  return `${baseUrl}?seed=${seed}&size=${size}&backgroundColor=${backgroundColor}&style=circle`;
};

/**
 * Alternative function for marketplace-style avatars (if needed)
 * @param title - The certificate title/description used as seed
 * @param size - The size of the avatar (default: 200)
 * @returns The Dicebear API URL for the generated avatar
 */
export const generateMarketplaceAvatar = (title: string, size: number = 200): string => {
  const baseUrl = 'https://api.dicebear.com/7.x/avataaars/svg';
  const backgroundColor = '00acc1,039be5,3f51b5,8e24aa,e91e63,ff5722,ff9800,ffc107,4caf50,8bc34a';
  
  const seed = title && title.trim() ? encodeURIComponent(title.trim()) : 'default-certificate';
  
  return `${baseUrl}?seed=${seed}&size=${size}&backgroundColor=${backgroundColor}`;
};
