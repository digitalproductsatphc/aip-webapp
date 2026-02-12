import { initializeMsal } from './services/msalInstance';

export { initializeMsal };

export const initializeAuth = async () => {
  try {
    console.log('[Init] Initializing MSAL...');
    const result = await Promise.race([
      initializeMsal(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MSAL initialization timeout')), 5000)
      )
    ]);
    console.log('[Init] MSAL initialized successfully');
    return true;
  } catch (error) {
    console.error('[Init] Failed to initialize MSAL:', error);
    return false;
  }
};