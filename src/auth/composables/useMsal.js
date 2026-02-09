import { inject, computed, ref } from 'vue';
import { graphService } from '../services/graphService';

/**
 * Composable for using MSAL authentication in components
 */
export function useMsal() {
  const msalInstance = inject('msalInstance');
  const isAuthenticated = inject('isAuthenticated', ref(false));
  const userAccount = inject('userAccount', ref(null));
  const login = inject('login', () => {
    console.error('Login function not available');
  });
  const logout = inject('logout', () => {
    console.error('Logout function not available');
  });
  
  const userPhotoUrl = ref(null);

  // Get user info from the account
  const userInfo = computed(() => {

    if (!userAccount?.value) return null;
    console.log(userAccount.value.idTokenClaims)
    return {
      name: userAccount.value.name || userAccount.value.username,
      username: userAccount.value.username,
      roles: userAccount.value.idTokenClaims?.roles || [],
      photoUrl: userPhotoUrl.value
    };
  });

  // Fetch user profile photo
  const fetchUserPhoto = async () => {
    if (userAccount?.value && !userPhotoUrl.value) {
      const photoUrl = await graphService.getUserPhoto();
      userPhotoUrl.value = photoUrl;
    }
  };
  
  // Check if user has a specific role
  const hasRole = (role) => {
    if (!userAccount?.value || !userAccount.value.idTokenClaims?.roles) {
      return false;
    }
    
    return userAccount.value.idTokenClaims.roles.includes(role);
  };
  
  // Get access token for API calls
  const getAccessToken = async () => {
    if (!msalInstance || !userAccount?.value) {
      throw new Error('MSAL not initialized or user not logged in');
    }
    
    const request = {
      scopes: ['User.Read'],
      account: userAccount.value
    };
    
    try {
      // Ensure MSAL is initialized
      if (typeof msalInstance.acquireTokenSilent !== 'function') {
        throw new Error('MSAL instance not properly initialized');
      }
      
      const response = await msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      // If silent token acquisition fails, fallback to interactive method
      if (error.name === 'InteractionRequiredAuthError') {
        return msalInstance.acquireTokenRedirect(request);
      }
      throw error;
    }
  };
  
  return {
    isAuthenticated,
    userAccount,
    userInfo,
    login,
    logout,
    hasRole,
    getAccessToken,
    fetchUserPhoto
  };
}