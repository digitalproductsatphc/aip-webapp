<template>
  <div class="help-view">
    <div class="fixed-header" :class="{ 'visible': isScrolled }">
      <button class="back-button" @click="$router.go(-1)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h1 class="help-title">Help Centre</h1>
    </div>

    <section class="hero">
      <div class="hero-content">
        <button class="hero-back-button" @click="$router.go(-1)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div class="help-section">
          <h1 class="help-header">Help Centre</h1>
          <h2 class="hero-title">How can we help you?</h2>
          <p class="hero-subtitle">
            Find answers to common questions and get support for using our platform.
          </p>
        </div>
      </div>
    </section>

    <section class="cards">
      <div class="info-card">
        <div class="icon-circle"><i class="pi pi-play" /></div>
        <h3>Getting Started</h3>
        <div class="help-content">
          <div class="help-item">
            <h4>How do I log in?</h4>
            <p>Use your organizational credentials to sign in through Microsoft Azure AD authentication.</p>
          </div>
          <div class="help-item">
            <h4>Which systems can I access?</h4>
            <p>Your access depends on your assigned roles. Contact your administrator if you need additional permissions.</p>
          </div>
          <div class="help-item">
            <h4>How do I switch between systems?</h4>
            <p>Use the system selection page to choose between available platforms like ACSP and IHN.</p>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="icon-circle"><i class="pi pi-user" /></div>
        <h3>Account & Profile</h3>
        <div class="help-content">
          <div class="help-item">
            <h4>How do I update my profile?</h4>
            <p>Your profile information is managed through your organization's directory. Contact IT support for changes.</p>
          </div>
          <div class="help-item">
            <h4>Why can't I see my photo?</h4>
            <p>Profile photos are synced from your organizational account. It may take time to appear or require admin setup.</p>
          </div>
          <div class="help-item">
            <h4>How do I log out?</h4>
            <p>Go to your Profile page and click the "Log Out" button at the bottom.</p>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="icon-circle"><i class="pi pi-cog" /></div>
        <h3>Technical Issues</h3>
        <div class="help-content">
          <div class="help-item">
            <h4>The page won't load properly</h4>
            <p>Try refreshing the page or clearing your browser cache. Ensure you're using a supported browser.</p>
          </div>
          <div class="help-item">
            <h4>I'm getting authentication errors</h4>
            <p>Check your network connection and try logging out and back in. Contact IT if the issue persists.</p>
          </div>
          <div class="help-item">
            <h4>External systems won't open</h4>
            <p>Ensure pop-ups are enabled for this site. Some systems open in new tabs or windows.</p>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="icon-circle"><i class="pi pi-phone" /></div>
        <h3>Contact Support</h3>
        <div class="help-content">
          <div class="help-item">
            <h4>IT Support</h4>
            <p>For technical issues, login problems, or system access requests.</p>
            <p><strong>Email:</strong> itsupport@phc.ca</p>
          </div>
          <div class="help-item">
            <h4>Platform Support</h4>
            <p>For questions about specific systems or platform functionality.</p>
            <p><strong>Email:</strong> itsupport@phc.ca</p>
          </div>
          <div class="help-item">
            <h4>Emergency Support</h4>
            <p>For urgent technical issues affecting patient care.</p>
            <p><strong>Email:</strong> itsupport@phc.ca</p>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="icon-circle"><i class="pi pi-exclamation-triangle" /></div>
        <h3>Report a Problem</h3>
        <div class="help-content">
          <div class="help-item">
            <h4>How to report an issue</h4>
            <p>Use the "Report a problem" option in your Profile page to submit detailed issue reports to our support team.</p>
          </div>
          <div class="help-item">
            <h4>What information to include</h4>
            <p>Provide a clear subject line and detailed description including steps to reproduce the problem for faster resolution.</p>
          </div>
          <div class="help-item">
            <h4>Response time</h4>
            <p>Our support team typically responds within 24-48 hours. Urgent issues are prioritized and addressed sooner.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    const isScrolled = ref(false)

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 100
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return { 
      isScrolled
    }
  }
}
</script>

<style scoped>
.help-view {
  min-height: 100vh;
  background: #f8fafc;
}

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
  transition: all 0.3s ease;
}

.fixed-header.visible {
  opacity: 1;
  transform: translateY(0);
}

.back-button {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #111827;
}

.help-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
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
  position: relative;
}

.hero-back-button {
  position: absolute;
  left: 0;
  top: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 12px;
  border-radius: 50%;
  cursor: pointer;
  color: #ffffff;
  transition: background-color 0.2s ease;
}

.hero-back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.help-section {
  padding-top: 24px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.help-header {
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 12px;
  color: #fff;
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.cards {
  max-width: 900px;
  margin: -48px auto 0;
  padding: 0 16px 80px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.info-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  text-align: center;
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
}

.help-content {
  text-align: left;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.help-item {
  margin-bottom: 20px;
}

.help-item:last-child {
  margin-bottom: 0;
}

.help-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.help-item p {
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 4px;
}

@media (min-width: 768px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>