import { inject, computed, ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import { MsalPlugin } from '@tashelix/capacitor-msal-auth';
import { graphService } from '../services/graphService';

export function useMsal() {

  const msalInstance = inject('msalInstance');
  const isAuthenticated = inject('isAuthenticated', ref(false));
  const userAccount = inject('userAccount', ref(null));
  const login = inject('login');
  const logout = inject('logout');

  const userPhotoUrl = ref(null);

  // Decode JWT helper
  const decodeJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };

  const userInfo = computed(() => {
    if (!userAccount?.value) return null;

    if (Capacitor.isNativePlatform()) {
      const idToken = userAccount.value.idToken;
      const claims = idToken ? decodeJwt(idToken) : null;

      return {
        name: claims?.name || userAccount.value.username,
        username: claims?.preferred_username || userAccount.value.username,
        roles: claims?.roles || [],
        photoUrl: userPhotoUrl.value
      };
    }

    return {
      name: userAccount.value.name,
      username: userAccount.value.username,
      roles: userAccount.value.idTokenClaims?.roles || [],
      photoUrl: userPhotoUrl.value
    };
  });

  const hasRole = (role) => {
    return userInfo.value?.roles?.includes(role);
  };

  const getAccessToken = async () => {

    if (!userAccount?.value) {
      throw new Error('User not logged in');
    }

    if (Capacitor.isNativePlatform()) {

      const accounts = await MsalPlugin.getAccounts();
      const username = accounts.accounts[0].username;

      const tokenResult = await MsalPlugin.acquireToken({
        scopes: ['User.Read'],
        identifier: username
      });

      return tokenResult.accessToken;
    }

    const request = {
      scopes: ['User.Read'],
      account: userAccount.value
    };

    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  };

  const fetchUserPhoto = async () => {
    if (userPhotoUrl.value) return;
    
    if (Capacitor.isNativePlatform()) {
      userPhotoUrl.value = 'pi pi-user';
      return;
    }
    
    try {
      const photoUrl = await graphService.getUserPhoto();
      userPhotoUrl.value = photoUrl;
    } catch (error) {
      console.log('[useMsal] Photo fetch failed:', error.code || error.message);
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
