import { authService } from './authService';

export const graphService = {
  /**
   * Get user's profile photo from Microsoft Graph
   */
  async getUserPhoto() {
    try {
      const accessToken = await authService.getAccessToken();
      
      const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to fetch user photo:', error);
      return null;
    }
  }
};