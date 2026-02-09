import msalInstance, { initializeMsal } from '../services/msalInstance';

/**
 * Authentication guard for protecting routes
 * @param {Object} to - Route to navigate to
 * @param {Object} from - Route navigating from
 * @param {Function} next - Navigation callback
 */
export const authGuard = async (to, from, next) => {
    try {
        // Initialize MSAL if not already initialized
        await initializeMsal();
        
        // Handle redirect promise to complete authentication
        await msalInstance.handleRedirectPromise();
        
        // Check if user is authenticated
        const accounts = msalInstance.getAllAccounts();
        const isAuthenticated = accounts.length > 0;
        
        // Set active account if not set
        if (isAuthenticated && !msalInstance.getActiveAccount()) {
            msalInstance.setActiveAccount(accounts[0]);
        }
        
        console.log('Auth Guard - isAuthenticated:', isAuthenticated, 'accounts:', accounts.length, 'route:', to.path);
        
        // If user is already authenticated and trying to access login page
        if (isAuthenticated && to.name === 'login') {
            // Check if there's a redirect query parameter
            const redirectTo = to.query.redirect || '/systems';
            return next(redirectTo);
        }
        
        // If the route doesn't require authentication, continue
        if (!to.meta.requiresAuth) {
            return next();
        }

        
        // If route requires authentication and user is not authenticated
        if (to.meta.requiresAuth && !isAuthenticated) {
            // Redirect to login page with the intended destination
            return next({ 
                name: 'login', 
                query: { redirect: to.fullPath } 
            });
        }
        
        // If route requires specific roles
        if (to.meta.roles && to.meta.roles.length > 0) {
            // Get user roles from ID token claims
            const activeAccount = msalInstance.getActiveAccount() || accounts[0];
            const userRoles = activeAccount?.idTokenClaims?.roles || [];
            
            // Check if user has at least one of the required roles
            const hasRequiredRole = to.meta.roles.some(role => userRoles.includes(role));
            
            // if (!hasRequiredRole) {
            //     // Redirect to access denied page
            //     return next({ name: 'access-denied' });
            // }
        }
        
        // Continue navigation
        next();
    } catch (error) {
        console.error('Auth guard error:', error);
        // In case of error, redirect to login with redirect parameter
        next({ 
            name: 'login', 
            query: { redirect: to.fullPath } 
        });
    }
};

export default authGuard;