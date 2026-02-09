<template>
  <div class="about-view">
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
      <h1 class="about-title">About Us</h1>
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
        <div class="about-section">
          <h1 class="about-header">About Us</h1>
          <img src="@/assets/images/Elevare-Health-gradient-white-RGB.webp" alt="PHCV Logo" class="logo-md" />
         
          <h2 class="hero-title">
            Building the Future of Health Innovation
          </h2>
          <p class="hero-subtitle">
            We identify, nurture, and scale transformative health technologies —
            reinvesting success back into the health system.
          </p>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section class="cards">
      <div class="info-card">
        <div class="icon-circle"><i class="pi pi-building" /></div>
        <h3>Who We Are</h3>
        <p>
          Elevare Health is the technology and commercialization platform of
          Providence Health Care Ventures. We bridge clinical insight with innovation,
          accelerating solutions that improve patient outcomes.
        </p>
      </div>

      <div class="info-card">
        <div class="icon-circle"><i class="pi pi-send" /></div>
        <h3>Our Purpose</h3>
        <p>
          We cultivate a thriving ecosystem for validation, growth, and scale —
          leveraging deep expertise across cardiac, renal, substance use, and
          infectious disease domains.
        </p>
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

    return { isScrolled }
  }
}
</script>

<style scoped>
.about-view {
  min-height: 100vh;
  background: #f8fafc;
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

.about-title {
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

.about-section {
  padding-top: 24px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.about-header {
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 24px;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 12px;
  color: #fff
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.logo-md {
  width: 120px;
  height: auto;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)) brightness(1.6);
}

/* Cards */
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
  margin-bottom: 8px;
}

.info-card p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #475569;
}

/* Tablet+ */
@media (min-width: 768px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero-title {
    font-size: 2.3rem;
  }
}


</style>