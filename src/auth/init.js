import { initializeMsal } from './services/msalInstance';

export { initializeMsal };

export const initializeAuth = async () => {
  try {
    console.log('Initializing MSAL...');
    await initializeMsal();
    console.log('MSAL initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize MSAL:', error);
    return false;
  }
};