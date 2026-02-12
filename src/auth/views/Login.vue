<script setup>
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { MsalPlugin } from '@tashelix/capacitor-msal-auth';
import { loginRequest } from '../config/msalConfig';
import { initializeMsal } from '../services/msalInstance';

const isAuthenticated = inject('isAuthenticated');
const userAccount = inject('userAccount');
const router = useRouter();
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;

  try {
    if (Capacitor.isNativePlatform()) {
      const result = await MsalPlugin.login({
        scopes: loginRequest.scopes
      });

      console.log('[Login] Native login result:', JSON.stringify(result, null, 2));

      if (result) {
        userAccount.value = result.account || result;
        isAuthenticated.value = true;
        router.replace('/systems');
      }

    } else {
      const msalInstance = await initializeMsal();
      await msalInstance.loginRedirect(loginRequest);
    }

  } catch (error) {
    console.error('[Login] Login error:', JSON.stringify(error, null, 2));
    alert('Login failed: ' + (error?.errorMessage || error?.message || 'Unknown error'));
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await MsalPlugin.getAccounts();

      if (result?.accounts?.length) {
        userAccount.value = result.accounts[0];
        isAuthenticated.value = true;
        router.replace('/systems');
      }

    } catch (error) {
      console.log('[Login] No cached account');
    }

  } else {
    const msalInstance = await initializeMsal();
    const response = await msalInstance.handleRedirectPromise();

    if (response) {
      userAccount.value = response.account;
      isAuthenticated.value = true;
      router.replace('/systems');
    }
  }
});

</script>

<template>
  <div class="auth-screen">
    <div class="content-container">
      <div class="logo-section">
        <img src="@/assets/images/aip-logo.png" alt="AIP Logo" class="main-logo" />
        <p class="tagline">Secure Access for Healthcare Professionals</p>
      </div>

      <button class="login-btn" @click="handleLogin" :disabled="isLoading">
        <span class="btn-content">
          <i class="pi pi-microsoft" v-if="!isLoading"></i>
          <div class="spinner" v-else></div>
          <span>{{ isLoading ? 'Signing in...' : 'Sign in with Microsoft' }}</span>
        </span>
      </button>
    </div>
    
    <div class="footer">
      <img src="@/assets/images/Elevare-Health-gradient-white-RGB.webp" alt="EH Logo" class="footer-logo" />
    </div>
  </div>
</template>

<style scoped>
.auth-screen {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  background-image: url('@/assets/images/elevare-health-hero-banner2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  padding-top: max(16px, env(safe-area-inset-top));
  padding-bottom: max(80px, env(safe-area-inset-bottom) + 60px);
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
  overflow: hidden;
}

.auth-screen::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
}

.content-container {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.logo-section {
  margin-bottom: 48px;
}

.main-logo {
  width: 170px;
  height: auto;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)) brightness(1.6);
}

.tagline {
  color: white;
  font-size: 1.1rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: -50px;
}

.login-btn {
  width: 280px;
  height: 48px;
  border-radius: 14px;
  border: none;
  background: #fff;
  color: #000;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0, 120, 212, 0.4);
  margin: 0 auto 22px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background: #f0f0f0;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pi-microsoft {
  font-size: 1.2rem;
}

.footer {
  position: absolute;
  bottom: max(20px, env(safe-area-inset-bottom) + 10px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.footer-logo {
  width: 120px;
  height: auto;
  opacity: 0.8;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)) brightness(1.6);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Small phones (320px - 480px) */
@media (max-width: 480px) {
  .auth-screen {
    padding: 12px;
    padding-bottom: max(70px, env(safe-area-inset-bottom) + 50px);
  }
  
  .content-container {
    max-width: 320px;
  }
  
  .main-logo {
    width: 140px;
  }
  
  .tagline {
    font-size: 1.1rem;
    margin-top: -40px;
  }
  
  .login-btn {
    width: 100%;
    max-width: 280px;
    height: 50px;
    font-size: 14px;
  }
  
  .footer-logo {
    width: 100px;
  }
}

/* Very small phones (max-width: 360px) */
@media (max-width: 360px) {
  .logo-section {
    margin-bottom: 32px;
  }
  
  .main-logo {
    width: 120px;
  }
  
  .tagline {
    font-size: 1rem;
    margin-top: -35px;
  }
  
  .login-btn {
    height: 48px;
    font-size: 13px;
  }
  
  .footer-logo {
    width: 90px;
  }
}

/* Large phones and small tablets (481px - 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .main-logo {
    width: 180px;
  }
  
  .tagline {
    font-size: 1.15rem;
  }
  
  .login-btn {
    width: 300px;
    height: 52px;
    font-size: 16px;
  }
}

/* Tablets and small desktops (769px+) */
@media (min-width: 769px) {
  .auth-screen {
    padding: 32px;
  }
  
  .main-logo {
    width: 200px;
  }
  
  .tagline {
    font-size: 1.2rem;
    margin-top: -55px;
  }
  
  .login-btn {
    width: 320px;
    height: 56px;
    font-size: 16px;
  }
  
  .footer-logo {
    width: 140px;
  }
}

/* Landscape orientation adjustments */
@media (orientation: landscape) and (max-height: 600px) {
  .logo-section {
    margin-bottom: 24px;
  }
  
  .main-logo {
    width: 120px;
  }
  
  .tagline {
    font-size: 1rem;
    margin-top: -30px;
  }
  
  .login-btn {
    height: 44px;
    margin-bottom: 16px;
  }
  
  .footer {
    bottom: max(10px, env(safe-area-inset-bottom) + 5px);
  }
  
  .footer-logo {
    width: 80px;
  }
}
</style>