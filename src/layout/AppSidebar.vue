<script setup>
import { useLayout } from './composables/layout';
import AppMenu from './AppMenu.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const { layoutConfig } = useLayout();
const route = useRoute();

// Determine which system we're in based on the route
const currentSystem = computed(() => {
    const path = route.path;
    if (path.startsWith('/acsp')) {
        return { name: 'ACSP', color: '#FF5252' };
    } else if (path.startsWith('/medhandover')) {
        return { name: 'MedHandover', color: '#2196F3' };
    }
    return { name: 'System Selection', color: '#4CAF50' };
});
</script>

<template>
    <div class="layout-sidebar" :class="{ 'layout-sidebar-dark': layoutConfig.darkMenu }">
        <div class="layout-sidebar-header">
            
                <router-link to="/" class="app-logo-link">
                </router-link>
        </div>
        <div class="layout-menu-container">
            <app-menu />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.app-logo {
    display: flex;
    align-items: center;
    padding: 1rem;
    
    &-link {
        display: flex;
        align-items: center;
        text-decoration: none;
    }
    
    &-image {
        height: 2rem;
        margin-right: 0.5rem;
    }
    
    &-text {
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--text-color);
    }
}
</style>