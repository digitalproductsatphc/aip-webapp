import { Capacitor } from '@capacitor/core';
import { MsalPlugin } from '@tashelix/capacitor-msal-auth';
import { initializeMsal } from '../services/msalInstance';

export const authGuard = async (to, from, next) => {
    console.log('[authGuard] Checking route:', to.path, 'requiresAuth:', to.meta.requiresAuth);
    
    if (!to.meta.requiresAuth) {
        console.log('[authGuard] Route does not require auth, allowing');
        next();
        return;
    }

    let isAuthenticated = false;

    if (Capacitor.isNativePlatform()) {
        console.log('[authGuard] Native platform, checking accounts');
        try {
            const result = await MsalPlugin.getAccounts();
            isAuthenticated = result?.accounts?.length > 0;
            console.log('[authGuard] Mobile auth result:', isAuthenticated);
        } catch (error) {
            console.log('[authGuard] Mobile auth check failed:', error);
        }
    } else {
        console.log('[authGuard] Web platform, checking auth...');
        const msalInstance = await initializeMsal();
        await msalInstance.handleRedirectPromise();
        const accounts = msalInstance.getAllAccounts();
        isAuthenticated = accounts.length > 0;
        
        if (isAuthenticated && !msalInstance.getActiveAccount()) {
            msalInstance.setActiveAccount(accounts[0]);
        }
        console.log('[authGuard] Web auth result:', isAuthenticated);
    }
    
    if (isAuthenticated && to.name === 'login') {
        console.log('[authGuard] User authenticated, redirecting from login to systems');
        next('/systems');
        return;
    }
    
    if (!isAuthenticated && to.meta.requiresAuth) {
        console.log('[authGuard] User not authenticated, redirecting to login');
        next({ name: 'login', query: { redirect: to.fullPath } });
        return;
    }
    
    console.log('[authGuard] Allowing navigation to:', to.path);
    next();
};

export default authGuard;