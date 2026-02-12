<template>
  <div v-if="loading" class="msal-loading">
    <div class="loading-spinner"></div>
    <p>Authenticating...</p>
  </div>
  <slot v-else></slot>
</template>

<script>
import { ref, onMounted, provide } from 'vue';
import { Capacitor } from '@capacitor/core';
import { MsalPlugin } from '@tashelix/capacitor-msal-auth';
import { loginRequest } from '../config/msalConfig';
import { initializeMsal } from '../services/msalInstance';

export default {
  name: 'MsalAuthProvider',
  setup() {
    const loading = ref(false);
    const isAuthenticated = ref(false);
    const userAccount = ref(null);
    let msalInstance = null;
    
    console.log('[MsalAuthProvider] Setup called');
    
    provide('isAuthenticated', isAuthenticated);
    provide('userAccount', userAccount);
    
    const handleResponse = (response) => {
      console.log('[MsalAuthProvider] handleResponse:', response);
      if (response !== null) {
        userAccount.value = response.account || response;
        isAuthenticated.value = true;
      }
      console.log('[MsalAuthProvider] Response handled');
    };
    
    const login = async () => {
      console.log('[MsalAuthProvider] login triggered');
      try {
        if (Capacitor.isNativePlatform()) {
          console.log('[MsalAuthProvider] Native login...');
          const result = await MsalPlugin.login({ scopes: loginRequest.scopes });
          console.log('[MsalAuthProvider] Native login result:', result);
          if (result && result.accessToken) {
            userAccount.value = result.account || result;
            isAuthenticated.value = true;
          }
        } else {
          console.log('[MsalAuthProvider] Web login redirect...');
          await msalInstance.loginRedirect(loginRequest);
        }
      } catch (error) {
        console.error('[MsalAuthProvider] Login error:', error);
      }
    };
    
    const logout = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          await MsalPlugin.logout();
        } else {
          const logoutRequest = {
            account: msalInstance.getActiveAccount(),
          };
          msalInstance.logoutRedirect(logoutRequest);
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
    
    provide('login', login);
    provide('logout', logout);
    
    onMounted(async () => {
      console.log('[MsalAuthProvider] onMounted triggered');
      try {
        console.log('[MsalAuthProvider] Getting MSAL instance...');
        msalInstance = await initializeMsal();
        console.log('[MsalAuthProvider] MSAL instance retrieved:', !!msalInstance);
        
        if (Capacitor.isNativePlatform()) {
          console.log('[MsalAuthProvider] Native platform detected');
          try {
            const result = await MsalPlugin.getAccounts();
            console.log('[MsalAuthProvider] getAccounts result:', result);
            if (result?.accounts && result.accounts.length > 0) {
              userAccount.value = result.accounts[0];
              isAuthenticated.value = true;
            }
          } catch (error) {
            console.log('[MsalAuthProvider] No active account:', error);
          }
        } else {
          console.log('[MsalAuthProvider] Web platform detected');
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0]);
            userAccount.value = accounts[0];
            isAuthenticated.value = true;
          }
        }
        console.log('[MsalAuthProvider] onMounted completed, isAuthenticated:', isAuthenticated.value);
      } catch (error) {
        console.error('[MsalAuthProvider] Error:', error, error.stack);
      }
    });
    
    return {
      loading
    };
  }
};
</script>

<style scoped>
.msal-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>