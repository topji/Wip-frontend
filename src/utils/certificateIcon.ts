// Certificate icon generator for hash certificates
export const generateCertificateIcon = (size: number = 200): string => {
  // Create a simple SVG icon that represents a hash/certificate
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#5865F2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#4752C4;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background Circle -->
      <circle cx="100" cy="100" r="90" fill="url(#grad1)" stroke="#fff" stroke-width="4"/>
      
      <!-- Hash Symbol -->
      <g fill="white" stroke="white" stroke-width="3" stroke-linecap="round">
        <line x1="70" y1="60" x2="70" y2="140"/>
        <line x1="130" y1="60" x2="130" y2="140"/>
        <line x1="50" y1="80" x2="150" y2="80"/>
        <line x1="50" y1="120" x2="150" y2="120"/>
      </g>
      
      <!-- Certificate Border -->
      <rect x="40" y="40" width="120" height="120" fill="none" stroke="white" stroke-width="2" rx="8"/>
      
      <!-- Small decorative elements -->
      <circle cx="60" cy="60" r="3" fill="white" opacity="0.7"/>
      <circle cx="140" cy="60" r="3" fill="white" opacity="0.7"/>
      <circle cx="60" cy="140" r="3" fill="white" opacity="0.7"/>
      <circle cx="140" cy="140" r="3" fill="white" opacity="0.7"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}; 