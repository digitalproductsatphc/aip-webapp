<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Always show some tabs for testing
const menuItems = [
    { label: 'Patient List', icon: 'pi pi-users', to: '/acsp/newPatients' },
    { label: 'Provider List', icon: 'pi pi-user-edit', to: '/acsp/providers' }
];

const isActive = (item) => {
    return route.path === item.to;
};

const navigateTo = (item) => {
    router.push(item.to);
};
</script>

<template>
    <div class="tab-menu">
        <div class="tab-menu__tabs">
            <button
                v-for="item in menuItems"
                :key="item.to"
                class="tab-menu__tab"
                :class="{ 'tab-menu__tab--active': isActive(item) }"
                @click="navigateTo(item)"
            >
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.tab-menu {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 0 1rem;
}

.tab-menu__tabs {
    display: flex;
    gap: 0;
}

.tab-menu__tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border: none;
    background: transparent;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    font-size: 0.875rem;
    border-bottom: 3px solid transparent;
}

.tab-menu__tab:hover {
    color: #334155;
    background: #f8fafc;
}

.tab-menu__tab--active {
    color: #1d4ed8;
    border-bottom-color: #1d4ed8;
    background: #dbeafe;
    font-weight: 600;
}

.tab-menu__tab i {
    font-size: 1rem;
}
</style>