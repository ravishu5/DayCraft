export const APP_CURRENT_VERSION = '1.0.0';
export const APP_BUILD_NUMBER = 1;

// Config URLs to check in order of priority
export const VERSION_CONFIG_ENDPOINTS = [
  'http://localhost:5173/version-config.json',
  'http://192.168.1.10:5173/version-config.json',
  'https://raw.githubusercontent.com/ravishu5/DayCraft/main/version-config.json',
  '/version-config.json'
];
