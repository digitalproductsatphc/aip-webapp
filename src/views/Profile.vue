<template>
  <div class="profile-view">
    <div class="fixed-header" :class="{ 'visible': isScrolled }">
      <h1 class="profile-title">Profile</h1>
    </div>

    <section class="hero">
      <div class="hero-content">
        <div class="profile-section">
          <h1 class="profile-header">Profile</h1>
          <Avatar
            :image="userPhotoUrl"
            size="xlarge"
            shape="circle"
            class="user-avatar"
          />
          <h2 class="username-text">{{ userInfo?.name || 'User' }}</h2>
          <p class="user-email">{{ userInfo?.username || 'No email available' }}</p>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section class="cards">
      <div class="info-card">
        <div class="icon-circle"><i class="pi pi-user" /></div>
        <h3>Account</h3>
        <div class="card-item">
          <span>Roles</span>
          <span class="secondary-text">
            {{ userInfo?.roles?.length ? userInfo.roles.join(', ') : 'None' }}
          </span>
        </div>
      </div>

      <div class="info-card">
        <div class="icon-circle"><i class="pi pi-cog" /></div>
        <h3>Support</h3>
        <div class="card-item clickable" @click="goToHelp">
          <span>Help Centre</span>
          <i class="pi pi-chevron-right" />
        </div>
        <div class="card-item clickable" @click="goToReport">
          <span>Report a problem</span>
          <i class="pi pi-chevron-right" />
        </div>
      </div>

      <div class="info-card">
        <div class="icon-circle"><i class="pi pi-info-circle" /></div>
        <h3>About</h3>
        <div class="card-item clickable" @click="goToAbout">
          <span>About Us</span>
          <i class="pi pi-chevron-right" />
        </div>
        <div class="card-item">
          <span>App Version</span>
          <span class="secondary-text">1.0.0</span>
        </div>
      </div>

      <div class="info-card logout-card">
        <div class="card-item clickable logout-item" @click="logout">
          <span>Log Out</span>
        </div>
      </div>
    </section>

    <BottomNav active-tab="profile" />
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMsal } from '@/auth/composables/useMsal'

import Avatar from 'primevue/avatar'
import BottomNav from '@/components/BottomNav.vue'

export default {
  components: {
    Avatar,
    BottomNav
  },

  setup() {
    const router = useRouter()
    const { userInfo, fetchUserPhoto, logout: msalLogout } = useMsal()
    const isScrolled = ref(false)

    const userPhotoUrl = computed(() =>
      userInfo.value?.photoUrl || null
    )

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 100
    }

    const logout = async () => {
      await msalLogout()
      router.push('/login')
    }

    const goToReport = () => {
      router.push('/report')
    }

    const goToHelp = () => {
      router.push('/help')
    }

    const goToAbout = () => {
      router.push('/about')
    }



    onMounted(() => {
      fetchUserPhoto()
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      userInfo,
      userPhotoUrl,
      isScrolled,
      logout,
      goToReport,
      goToHelp,
      goToAbout,

    }
  }
}
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 80px;
}

/* Header */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  transform: translateY(-100%);
}

.fixed-header.visible {
  opacity: 1;
  transform: translateY(0);
}

.profile-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

/* Hero */
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

.profile-section {
  padding-top: 24px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile-header {
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 24px;
}

.user-avatar {
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
}

.username-text {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.user-email {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* Cards */
.cards {
  max-width: 900px;
  margin: -48px auto 0;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.info-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #38bdf8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  margin: 0 auto 16px;
  color: white;
}

.info-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
  text-align: center;
}

.card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 1.1rem;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
  gap: 12px;
}

.card-item:last-child {
  border-bottom: none;
}

.card-item i {
  font-size: 0.9rem;
  color: #9ca3af;
}

.clickable {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable:hover {
  background-color: #f8fafc;
  border-radius: 8px;
  margin: 0 -12px;
  padding: 12px 12px;
}

.secondary-text {
  font-size: 1rem;
  color: #6b7280;
  text-align: right;
}

.logout-card {
  border: 1px solid #fecaca;
  background: #fef2f2;
  padding: 0px;
}

.logout-item {
  color: #ef4444;
  font-weight: 600;
  justify-content: center;
}

.logout-item:hover {
  background-color: #fee2e2;
}

/* Tablet+ */


@media (min-width: 768px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .logout-card {
    grid-column: 1 / -1;
  }
}
</style>