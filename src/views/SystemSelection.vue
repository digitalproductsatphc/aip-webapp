<template>
  <div class="system-selection">
    <section class="hero">
      <div class="hero-content">
        <img
          src="@/assets/images/aip-logo.png"
          alt="AI Platform"
          class="system-logo"
        />
        <div class="welcome-section">
          <div
            v-if="userPhotoUrl && !userPhotoUrl.startsWith('pi ')"
            class="user-avatar-wrapper"
          >
            <img :src="userPhotoUrl" class="user-avatar-img" />
          </div>
          <div
            v-else
            class="icon-circle user-avatar-icon"
            style="background: linear-gradient(135deg, #ffffff, #ffffff80)"
          >
            <i class="pi pi-user" style="color: #005a9e"></i>
          </div>
          <h2 class="hero-title">{{ userName }}</h2>
          <p class="hero-subtitle">Select a system to continue</p>
        </div>

        <div class="search-container">
          <i class="pi pi-search search-icon"></i>
          <input
            type="text"
            class="search-input"
            placeholder="Search systems"
            v-model="searchQuery"
          />
        </div>
      </div>
    </section>

    <section class="cards">
      <div
        v-for="system in filteredSystems"
        :key="system.id"
        class="info-card system-card"
        @click="navigateToSystem(system)"
      >
        <div
          class="icon-circle"
          :style="{ background: `linear-gradient(135deg, ${system.color}, ${system.color}80)` }"
        >
          <i :class="system.icon" />
        </div>
        <h3>{{ system.name }}</h3>
        <p v-if="system.description">{{ system.description }}</p>
      </div>
    </section>

    <BottomNav active-tab="home" />
  </div>
</template>


<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMsal } from '@/auth/composables/useMsal'

import BottomNav from '@/components/BottomNav.vue'

export default {
  components: {
    BottomNav
  },

  setup() {
    const router = useRouter()
    const { userInfo, fetchUserPhoto } = useMsal()

    const availableSystems = ref([])
    const searchQuery = ref('')

    const userName = computed(() =>
      userInfo.value?.name || userInfo.value?.displayName || 'User'
    )

    const userPhotoUrl = computed(() =>
      userInfo.value?.photoUrl || null
    )

    const filteredSystems = computed(() => {
      if (!searchQuery.value) return availableSystems.value
      return availableSystems.value.filter(system =>
        system.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        system.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const fetchAvailableSystems = () => {
      const userRoles = userInfo.value?.roles || []

      const allSystems = [
        {
          id: 'acsp',
          name: 'ACSP',
          description: '',
          icon: 'pi pi-android',
          color: '#ef4444',
          requiredRoles: [
            'PHCDataAnalytics_Developer',
            'PHC-HealthInformatics-AIPlatform-Developer',
            'PHC-HealthInformatics-ACSP'
          ]
        },
        {
          id: 'ihn',
          name: 'IHN',
          description: '',
          icon: 'pi pi-android',
          color: '#3b82f6',
          requiredRoles: [
            'PHCDataAnalytics_Developer',
            'PHC-HealthInformatics-IHN-Developer'
          ]
        }
      ]

      availableSystems.value =
        userRoles.length > 0
          ? allSystems.filter(system =>
              system.requiredRoles.some(role => userRoles.includes(role))
            )
          : allSystems

      if (availableSystems.value.length === 0) {
        router.push('/access-denied')
      }
    }

    const navigateToSystem = (system) => {
      const urls = {
        acsp: import.meta.env.VITE_ACSP_URL,
        ihn: import.meta.env.VITE_IHN_URL
      }

      const url = urls[system.id]
      if (url) window.open(url, '_blank')
    }

    onMounted(() => {
      fetchAvailableSystems()
      fetchUserPhoto()
    })

    return {
      availableSystems,
      filteredSystems,
      navigateToSystem,
      userName,
      userPhotoUrl,
      searchQuery
    }
  }
}
</script>

<style scoped>
.system-selection {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 120px;
}

.hero {
  background: linear-gradient(
    135deg,
    #005a9e 0%,
    #2563eb 60%,
    #38bdf8 100%
  );
  color: #ffffff;
  padding: 0px 20px 72px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
}

.hero-content {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.system-logo {
  width: 120px;
  height: auto;
}

.welcome-section {
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.user-avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar-icon {
  width: 80px;
  height: 80px;
  font-size: 2rem;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
}

.user-avatar {
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.hero-title {
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  margin: 0;
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 22px;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 48px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  outline: none;
  background: #ffffff;
  font-size: 16px;
  color: #0f172a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.cards {
  max-width: 900px;
  margin: -48px auto 0;
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  text-align: center;
  cursor: pointer;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  margin: 0 auto 16px;
  color: white;
}

.info-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.info-card p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #475569;
}

@media (max-width: 480px) {
  .system-logo {
    width: 100px;
  }
  
  .cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .info-card {
    padding: 20px;
  }
}
</style>