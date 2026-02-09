<template>
  <nav class="bottom-nav">
    <Button
      icon="pi pi-home"
      text
      class="nav-button"
      :class="{ active: activeTab === 'home' }"
      @click="goHome"
    />

    <Button
      icon="pi pi-user"
      text
      class="nav-button"
      :class="{ active: activeTab === 'profile' }"
      @click="goProfile"
    />
  </nav>
</template>

<script>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

export default {
  components: {
    Button
  },

  props: {
    activeTab: {
      type: String,
      default: 'home'
    }
  },

  setup() {
    const router = useRouter()

    const goHome = () => {
      router.push('/systems')
    }

    const goProfile = () => {
      router.push('/profile')
    }

    return {
      goHome,
      goProfile
    }
  }
}
</script>


<style scoped>
.bottom-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);

  bottom: calc(16px + env(safe-area-inset-bottom));
  z-index: 999;

  display: flex;
  gap: 12px;
  padding: 8px 16px;

  background: #ffffff;
  border-radius: 28px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.nav-button {
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
}

.nav-button :deep(.p-button-icon) {
  font-size: 1rem;
  color: #64748b;
}

.nav-button.active {
  background: linear-gradient(135deg, #005a9e 0%,  #0078d4 100%);
}

.nav-button.active :deep(.p-button-icon) {
  color: #ffffff;
}

/* Prevent hover effects on touch devices */
@media (hover: hover) {
  .nav-button:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  
  .nav-button.active:hover {
    background: linear-gradient(135deg, #005a9e 0%, #0078d4 100%) !important;
  }
}

/* Ensure active state overrides any touch/hover states */
.nav-button.active {
  background: linear-gradient(135deg, #005a9e 0%, #0078d4 100%) !important;
}

/* Remove default button hover/focus states on touch devices */
@media (hover: none) {
  .nav-button:hover,
  .nav-button:focus {
    background: transparent !important;
  }
  
  .nav-button.active:hover,
  .nav-button.active:focus {
    background: linear-gradient(135deg, #005a9e 0%, #0078d4 100%) !important;
  }
}
</style>
