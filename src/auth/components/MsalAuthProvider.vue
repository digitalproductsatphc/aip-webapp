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
import { App } from '@capacitor/app';
import { loginRequest } from '../config/msalConfig';
import msalInstance, { initializeMsal } from '../services/msalInstance';

export default {
  name: 'MsalAuthProvider',
  setup() {
    const loading = ref(true);
    const isAuthenticated = ref(false);
    const userAccount = ref(null);
    
    provide('msalInstance', msalInstance);
    provide('isAuthenticated', isAuthenticated);
    provide('userAccount', userAccount);
    
    const handleResponse = (response) => {
      if (response !== null) {
        userAccount.value = response.account;
        isAuthenticated.value = true;
      }
      loading.value = false;
    };
    
    const login = async () => {
      try {
        await msalInstance.loginRedirect(loginRequest);
      } catch (error) {
        console.error('Error during login:', error);
      }
    };
    
    const logout = () => {
      const logoutRequest = {
        account: msalInstance.getActiveAccount(),
      };
      msalInstance.logoutRedirect(logoutRequest);
    };
    
    provide('login', login);
    provide('logout', logout);
    
    onMounted(async () => {
      try {
        await initializeMsal();
        
        // Handle deep link for mobile
        if (Capacitor.isNativePlatform()) {
          App.addListener('appUrlOpen', async (data) => {
            console.log('App opened with URL:', data.url);
            if (data.url.includes('msauth.com.aiplatform.app://auth')) {
              const response = await msalInstance.handleRedirectPromise();
              handleResponse(response);
            }
          });
        }
        
        const response = await msalInstance.handleRedirectPromise();
        if (response) {
          handleResponse(response);
        } else {
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0]);
            userAccount.value = accounts[0];
            isAuthenticated.value = true;
          }
          loading.value = false;
        }
      } catch (error) {
        console.error('Error initializing MSAL:', error);
        loading.value = false;
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