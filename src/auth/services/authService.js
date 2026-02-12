import { loginRequest } from '../config/msalConfig';
import { Capacitor } from '@capacitor/core';
import { MsalPlugin } from '@tashelix/capacitor-msal-auth';
import { initializeMsal } from '../services/msalInstance';

const apiScopes = {
    api: ['User.Read']
};

export const authService = {
    async initialize() {
        const msalInstance = await initializeMsal();
        
        if (Capacitor.isNativePlatform()) {
            try {
                const result = await MsalPlugin.getAccounts();
                return !!result?.accounts;
            } catch {
                console.log('Error in authService');
                return false;
            }
        } else {
            await msalInstance.handleRedirectPromise();
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                msalInstance.setActiveAccount(accounts[0]);
                return true;
            }
            return false;
        }
    },

    async login() {
        if (Capacitor.isNativePlatform()) {
            return await MsalPlugin.login({ scopes: loginRequest.scopes });
        } else {
            const msalInstance = await initializeMsal();
            return msalInstance.loginRedirect(loginRequest);
        }
    },

    async logout() {
        if (Capacitor.isNativePlatform()) {
            return await MsalPlugin.logout();
        } else {
            const msalInstance = await initializeMsal();
            return msalInstance.logoutRedirect();
        }
    },

    async getUser() {
        if (Capacitor.isNativePlatform()) {
            const result = await MsalPlugin.getAccount();
            return result?.account || null;
        } else {
            const msalInstance = await initializeMsal();
            return msalInstance.getActiveAccount() || null;
        }
    },

    getUserRoles() {
        const account = this.getUser();
        if (!account) return [];
        const idTokenClaims = account.idTokenClaims;
        return idTokenClaims?.roles || [];
    },

    hasRole(role) {
        const roles = this.getUserRoles();
        return roles.includes(role);
    },

    async getAccessToken() {
        if (Capacitor.isNativePlatform()) {
            const result = await MsalPlugin.acquireToken({ scopes: apiScopes.api });
            return result.accessToken;
        } else {
            const msalInstance = await initializeMsal();
            const account = msalInstance.getActiveAccount();
            if (!account) {
                throw new Error('User not authenticated');
            }

            const silentRequest = {
                scopes: apiScopes.api,
                account: account
            };

            try {
                const response = await msalInstance.acquireTokenSilent(silentRequest);
                return response.accessToken;
            } catch (error) {
                if (error.name === 'InteractionRequiredAuthError') {
                    return msalInstance.acquireTokenRedirect(silentRequest);
                }
                throw error;
            }
        }
    }
};

export default authService;