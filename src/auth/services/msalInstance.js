import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../config/msalConfig';

// Create a single MSAL instance for the entire application
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
let initializePromise = null;

export const initializeMsal = async () => {
  if (!initializePromise) {
    initializePromise = msalInstance.initialize().then(() => {
      console.log('MSAL initialized successfully');
      return msalInstance;
    }).catch(error => {
      console.error('MSAL initialization failed:', error);
      throw error;
    });
  }
  
  return initializePromise;
};

// Export the MSAL instance
export default msalInstance;