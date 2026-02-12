import { MsalPlugin } from '@tashelix/capacitor-msal-auth';
import { Capacitor } from '@capacitor/core';
import { loginRequest } from '../config/msalConfig';

let msalInstance = null;
let initializePromise = null;
let nativeInitialized = false;

export const initializeMsal = async () => {
  console.log('[msalInstance] initializeMsal called, msalInstance:', !!msalInstance, 'initializePromise:', !!initializePromise);
  
  if (msalInstance) {
    console.log('[msalInstance] Returning existing instance');
    return msalInstance;
  }
  
  if (!initializePromise) {
    console.log('[msalInstance] Creating new initialization promise');
    initializePromise = (async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          console.log('[msalInstance] Native platform, nativeInitialized:', nativeInitialized);
          if (!nativeInitialized) {
            console.log('[msalInstance] Initializing native PCA...');
            await MsalPlugin.initializePcaInstance({
              clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
              tenant: import.meta.env.VITE_MSAL_TENANT_ID || '31f660a5-192a-4db3-92ba-ca424f1b259e',
              scopes: loginRequest.scopes,
              redirectUri: import.meta.env.VITE_MSAL_MOBILE_REDIRECT_URI
            });
            nativeInitialized = true;
            console.log('[msalInstance] Native PCA initialized');
          }
          msalInstance = MsalPlugin;
        } else {
          console.log('[msalInstance] Web platform, initializing...');
          const { PublicClientApplication } = await import('@azure/msal-browser');
          const { msalConfig } = await import('../config/msalConfig');
          msalInstance = new PublicClientApplication(msalConfig);
          await msalInstance.initialize();
          console.log('[msalInstance] Web MSAL initialized');
        }
        console.log('[msalInstance] Returning msalInstance');
        return msalInstance;
      } catch (error) {
        console.error('[msalInstance] Initialization error:', error);
        initializePromise = null;
        nativeInitialized = false;
        throw error;
      }
    })();
  }
  
  console.log('[msalInstance] Awaiting initialization promise');
  return initializePromise;
};

export default msalInstance;