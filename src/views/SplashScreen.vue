<template>
  <div class="splash-screen">
    <div class="logo-container">
      <img 
        src="@/assets/images/aip-logo-2.png" 
        alt="AI Platform" 
        class="splash-logo"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.replace('/login')
  }, 3000)
})
</script>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-logo {
  width: 120px;
  height: auto;
  animation: logoAnimation 3s ease-in-out infinite;
}

@keyframes logoAnimation {
  0% {
    filter: hue-rotate(-60deg) saturate(1.4) brightness(1.03);
  }
  25% {
    filter: hue-rotate(-10deg) saturate(1.55) brightness(1.055);
  }
  50% {
    filter: hue-rotate(0deg) saturate(1.7) brightness(1.08);
  }
  75% {
    filter: hue-rotate(20deg) saturate(1.6) brightness(1.055);
  }
  100% {
    filter: hue-rotate(-20deg) saturate(1.4) brightness(1.03);
  }
}
</style>