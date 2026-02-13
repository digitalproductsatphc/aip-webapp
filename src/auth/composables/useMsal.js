import { inject, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { MsalPlugin } from '@tashelix/capacitor-msal-auth';
import { graphService } from '../services/graphService';

export function useMsal() {
  const router = useRouter();
  const msalInstance = Capacitor.isNativePlatform() ? null : inject('msalInstance', null);
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

  // Monitor token expiration
  const checkTokenExpiration = () => {
    if (!userAccount?.value?.idTokenClaims?.exp) return;
    
    const expiresAt = userAccount.value.idTokenClaims.exp * 1000;
    const timeUntilExpiry = expiresAt - Date.now();
    
    if (timeUntilExpiry > 0) {
      setTimeout(() => router.push('/login'), timeUntilExpiry);
    } else {
      router.push('/login');
    }
  };

  if (!Capacitor.isNativePlatform()) {
    checkTokenExpiration();
  }

  const getAccessToken = async () => {
    if (!userAccount?.value) {
      router.push('/login');
      throw new Error('User not logged in');
    }

    if (Capacitor.isNativePlatform()) {

      const { accounts } = await MsalPlugin.getAccounts();
      const username = accounts[0].username;
      const result = await MsalPlugin.login({ identifier: username });

      return {
        accessToken: result.accessToken,
        idToken: result.idToken
      };
    }

    const request = {
      scopes: ['User.Read'],
      account: userAccount.value
    };

    try {
      const response = await msalInstance.acquireTokenSilent(request);
      return {
        accessToken: response.accessToken,
        idToken: response.idToken
      };
    } catch (error) {
      router.push('/login');
      throw error;
    }
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
