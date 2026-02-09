<template>
  <div class="report-view">
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
      <h1 class="report-title">Report a Problem</h1>
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
        <div class="report-section">
          <h1 class="report-header">Report a Problem</h1>
          <h2 class="hero-title">Help us improve</h2>
          <p class="hero-subtitle">
            Tell us about any issues you're experiencing and we'll work to resolve them quickly.
          </p>
        </div>
      </div>
    </section>

    <section class="form-section">
      <div class="form-container">
        <form @submit.prevent="submitReport" class="report-form">
          
          <div class="form-group">
            <label for="subject">Subject</label>
            <input 
              type="text" 
              id="subject" 
              v-model="form.subject"
              required
            />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              v-model="form.description"
              rows="6"
              required
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="$router.go(-1)">
              Cancel
            </button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMsal } from '@/auth/composables/useMsal'

export default {
  setup() {
    const router = useRouter()
    const { userInfo } = useMsal()
    const isScrolled = ref(false)
    const isSubmitting = ref(false)
    
    const form = ref({
      category: '',
      subject: '',
      description: '',
      priority: ''
    })

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 100
    }

    const submitReport = async () => {
      isSubmitting.value = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Show success message and redirect
        alert('Thank you! Your problem report has been submitted successfully. Our support team will review it and get back to you soon.')
        router.push('/profile')
      } catch (error) {
        alert('Sorry, there was an error submitting your report. Please try again or contact support directly.')
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return { 
      isScrolled,
      form,
      isSubmitting,
      submitReport
    }
  }
}
</script>

<style scoped>
.report-view {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 40px;
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

.report-title {
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

.report-section {
  padding-top: 24px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.report-header {
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

.form-section {
  max-width: 600px;
  margin: -48px auto 0;
  padding: 0 16px;
}

.form-container {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.report-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  color: #0f172a;
  background: #ffffff;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #ffffff;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .form-container {
    padding: 24px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>