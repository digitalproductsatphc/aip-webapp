import { loginRequest } from '../config/msalConfig';
import msalInstance, { initializeMsal } from '../services/msalInstance';

// API scopes for accessing backend
const apiScopes = {
    api: ['User.Read']
};

export const authService = {
    /**
     * Initialize the auth service
     */
    async initialize() {
        // Initialize MSAL
        await initializeMsal();
        
        // Handle redirect promise
        await msalInstance.handleRedirectPromise();
        
        // Check if user is signed in
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0]);
            return true;
        }
        return false;
    },

    /**
     * Login with redirect
     */
    login() {
        msalInstance.loginRedirect(loginRequest);
    },

    /**
     * Logout the user
     */
    logout() {
        msalInstance.logoutRedirect();
    },

    /**
     * Get the current authenticated user
     */
    getUser() {
        const account = msalInstance.getActiveAccount();
        return account || null;
    },

    /**
     * Get user roles from ID token claims
     */
    getUserRoles() {
        const account = msalInstance.getActiveAccount();
        if (!account) return [];
        
        // Azure AD roles are typically in the 'roles' claim
        const idTokenClaims = account.idTokenClaims;
        return idTokenClaims?.roles || [];
    },

    /**
     * Check if user has a specific role
     */
    hasRole(role) {
        const roles = this.getUserRoles();
        return roles.includes(role);
    },

    /**
     * Get access token for API calls
     */
    async getAccessToken() {
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
            // If silent token acquisition fails, fallback to interactive method
            if (error.name === 'InteractionRequiredAuthError') {
                return msalInstance.acquireTokenRedirect(silentRequest);
            }
            throw error;
        }
    }
};

export default authService;