<template>
  <div v-if="loading" class="msal-loading">
    <div class="loading-spinner"></div>
    <p>Authenticating...</p>
  </div>
  <slot v-else></slot>
</template>

<script>
import { ref, onMounted, provide } from 'vue';
import { loginRequest } from '../config/msalConfig';
import msalInstance, { initializeMsal } from '../services/msalInstance';

export default {
  name: 'MsalAuthProvider',
  setup() {
    const loading = ref(true);
    const isAuthenticated = ref(false);
    const userAccount = ref(null);
    
    // Provide the MSAL instance and auth state to child components
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
    
    // Provide login and logout methods
    provide('login', login);
    provide('logout', logout);
    
    onMounted(async () => {
      try {
        // Initialize MSAL instance
        await initializeMsal();
        
        // Handle redirect promise
        const response = await msalInstance.handleRedirectPromise();
        if (response) {
          handleResponse(response);
        } else {
          // Check if user is already signed in
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