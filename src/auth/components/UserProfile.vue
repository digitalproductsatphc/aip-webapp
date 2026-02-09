<template>
  <Card>
    <template #content>
      <div v-if="loading" class="flex justify-center py-10">
        <ProgressSpinner />
      </div>

      <div v-else-if="error" class="text-red-600 text-center py-4 font-medium">
        {{ error }}
      </div>

      <div v-else class="grid">
        <div class="col-12">
          <!-- User Info Header -->
          <div class="flex flex-column md:flex-row items-center gap-4">
            <div class="flex items-center justify-center bg-primary rounded-full" style="width: 64px; height: 64px">
              <i class="pi pi-user text-white text-3xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-surface-800 dark:text-surface-0 mb-1">
                {{ userInfo?.name || 'User' }}
              </h2>
              <p class="text-surface-500 dark:text-surface-400 m-0">
                {{ userInfo?.username || 'No username available' }}
              </p>
            </div>
          </div>

          <!-- Roles Section -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold text-surface-800 dark:text-surface-0 mb-2">Your Roles</h3>
            
            <div v-if="userInfo?.roles?.length" class="flex flex-wrap gap-2">
              <Chip
                v-for="role in userInfo.roles"
                :key="role"
                :label="role"
                class="bg-primary-reverse text-primary border-none"
              />
            </div>
            
            <p v-else class="text-surface-500 dark:text-surface-400">No roles assigned</p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>


<script>
import { ref, onMounted } from 'vue';
import { useMsal } from '../../auth/composables/useMsal';

export default {
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const { userInfo, logout } = useMsal();
    
    const handleLogout = () => {
      logout();
    };
    
    onMounted(async () => {
      try {
        loading.value = false;
      } catch (err) {
        error.value = 'Failed to load user profile';
        console.error('Error loading user profile:', err);
        loading.value = false;
      }
    });
    
    return {
      loading,
      error,
      userInfo,
      handleLogout
    };
  }
};
</script>