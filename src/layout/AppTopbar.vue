<script setup>
import { useLayout } from './composables/layout';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMsal } from '../../auth/composables/useMsal';
import AppConfigurator from './AppConfigurator.vue';
import AppTabMenu from './AppTabMenu.vue';
import Menu from 'primevue/menu';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const route = useRoute();
const router = useRouter();
const { userInfo, logout } = useMsal();
const menu = ref(null);
const systemMenu = ref(null);

// Profile menu items
const items = [
    { 
        label: 'Profile', 
        icon: 'pi pi-user', 
        command: () => {
            const profilePath = route.path.startsWith('/acsp') ? '/acsp/profile' : '/medhandover/profile';
            router.push(profilePath);
        }
    },
    { separator: true },
    { 
        label: 'Sign Out', 
        icon: 'pi pi-sign-out', 
        command: () => logout()
    }
];

const handleLogout = () => {
    logout();
};

// Navigation menu items (synced with sidebar)
const navMenuItems = computed(() => {
    const path = route.path;
    if (path.startsWith('/acsp')) {
        return [
            { label: 'New Admits Patient List', icon: 'pi pi-users', to: '/acsp/newPatients' },
            { label: 'Long-stays Patient List', icon: 'pi pi-users', to: '/acsp/longStayPatients' },
            { label: 'Provider List', icon: 'pi pi-user-edit', to: '/acsp/providers' }
        ];
    }
    if (path.startsWith('/medhandover')) {
        return [
            { label: 'Handover List', icon: 'pi pi-list', to: '/medhandover' }
        ];
    }
    return [];
});

const isNavActive = (item) => {
    return route.path === item.to;
};

const navigateToNav = (item) => {
    router.push(item.to);
};

// Current system info
const currentSystem = computed(() => {
    const path = route.path;
    if (path.startsWith('/acsp')) {
        return { name: 'ACSP', icon: 'pi pi-heart', color: '#e91e63' };
    }
    if (path.startsWith('/medhandover')) {
        return { name: 'Medical Handover', icon: 'pi pi-briefcase', color: '#1976d2' };
    }
    return null;
});

// System menu items
const systemMenuItems = [
    {
        label: 'ACSP',
        icon: 'pi pi-heart',
        command: () => router.push('/acsp/newPatients')
    },
    {
        label: 'Medical Handover', 
        icon: 'pi pi-briefcase',
        command: () => router.push('/medhandover')
    },
    { separator: true },
    {
        label: 'Change System',
        icon: 'pi pi-refresh',
        command: () => router.push('/')
    }
];
</script>

<template>
    <div class="layout-topbar-wrapper">
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                    <i class="pi pi-bars"></i>
                </button>
                <router-link to="/" class="layout-topbar-logo">
                    <img src="/assets/images/phcv-logo.png" class="logo-sm" alt="Logo" />
                    <span class="app-name">AI Platform</span>
                </router-link>
                
                <!-- System Indicator -->
                <div class="system-menu-container" v-if="currentSystem">
                    <Menu ref="systemMenu" :model="systemMenuItems" :popup="true" />
                    <button class="system-badge" @click="systemMenu.toggle($event)" :style="{ borderColor: currentSystem.color }" title="System Menu">
                        <i :class="currentSystem.icon" :style="{ color: currentSystem.color }"></i>
                        <span>{{ currentSystem.name }}</span>
                        <i class="pi pi-chevron-down system-badge__arrow"></i>
                    </button>
                </div>
                
                <!-- Navigation Menu -->
                <nav class="topbar-nav" v-if="navMenuItems.length > 0">
                    <button
                        v-for="item in navMenuItems"
                        :key="item.to"
                        class="topbar-nav-item"
                        :class="{ 'topbar-nav-item--active': isNavActive(item) }"
                        @click="navigateToNav(item)"
                    >
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                    </button>
                </nav>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                        <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                    </button>
                    <div class="relative">
                        <button
                            v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                            type="button"
                            class="layout-topbar-action layout-topbar-action-highlight"
                        >
                            <i class="pi pi-palette"></i>
                        </button>
                        <AppConfigurator />
                    </div>
                </div>

                <button
                    class="layout-topbar-menu-button layout-topbar-action"
                    v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                >
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <Menu ref="menu" :model="items" :popup="true" />
                        <button class="p-link layout-topbar-button" @click="menu.toggle($event)">
                            <i class="pi pi-user"></i>
                            <span>{{ userInfo?.name || 'User' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.layout-topbar-wrapper {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: var(--p-surface-0);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.app-name {
    font-size: 1.25rem;
    font-weight: 600;
    transition: color 0.2s;
    color: var(--p-text-color);
    white-space: nowrap;
}

.layout-topbar-button {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
    color: var(--p-text-color);
    
    i {
        margin-right: 0.5rem;
    }
    
    &:hover {
        background-color: var(--p-surface-100);
    }
}

.layout-topbar-menu-content {
    display: flex;
    align-items: center;
}

.layout-topbar-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    
    .logo-sm {
        height: 2rem;
        margin-right: 0.5rem;
    }
}

.layout-topbar-logo-container {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    overflow: hidden;
}

.system-menu-container {
    margin-left: 1.5rem;
    flex-shrink: 0;
    position: relative;
}

.system-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--p-surface-50);
    border: 2px solid;
    border-radius: 20px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-color);
    cursor: pointer;
    transition: all 0.2s ease;
}

.system-badge:hover {
    background: var(--p-surface-100);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.system-badge__arrow {
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
    margin-left: 0.25rem;
}

.topbar-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 1rem;
    flex-shrink: 0;
}

.topbar-nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    color: var(--p-text-muted-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 0.875rem;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
}

.topbar-nav-item::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.topbar-nav-item:hover {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}

.topbar-nav-item:hover::before {
    left: 100%;
}

.topbar-nav-item--active {
    background: var(--p-primary-500);
    color: #fff;
    font-weight: 600;
}

.topbar-nav-item--active:hover {
    background: var(--p-primary-600);
    color: #fff;
}

.topbar-nav-item i {
    font-size: 1rem;
    position: relative;
    z-index: 1;
}

.topbar-nav-item span {
    position: relative;
    z-index: 1;
}

/* Dark mode support */
.app-dark .system-badge {
    background: var(--p-surface-800);
}

.app-dark .system-badge:hover {
    background: var(--p-surface-700);
}

.app-dark .topbar-nav-item:hover {
    background: var(--p-surface-800);
}

.app-dark .topbar-nav-item--active {
    background: var(--p-primary-500);
    color: #fff;
}

.app-dark .topbar-nav-item--active:hover {
    background: var(--p-primary-600);
    color: #fff;
}

@media (max-width: 1200px) {
    .topbar-nav {
        margin-left: 1rem;
    }
}

@media (max-width: 1024px) and (min-width: 769px) {
    .topbar-nav {
        margin-left: 1rem;
        gap: 0.5rem;
    }
    
    .topbar-nav-item {
        padding: 0.5rem 0.75rem;
    }
    
    .system-menu-container {
        margin-left: 0.75rem;
    }
    
    .layout-topbar-logo-container {
        gap: 0.75rem;
    }
    
    .app-name {
        font-size: 1rem;
    }
}

@media (max-width: 768px) {
    .app-name {
        display: none;
    }
    
    .system-badge span {
        display: none;
    }
    
    .system-badge {
        padding: 0.375rem;
        min-width: 32px;
        justify-content: center;
    }
    
    .system-badge__arrow {
        display: none;
    }
    
    .layout-topbar-logo .logo-sm {
        margin-right: 0;
    }
    
    .system-menu-container {
        margin-left: 0.25rem;
    }
    
    .topbar-nav {
        gap: 0.125rem;
        margin-left: 0.5rem;
    }
    
    .topbar-nav-item span {
        display: none;
    }
    
    .topbar-nav-item {
        padding: 0.375rem;
        min-width: 36px;
        justify-content: center;
    }
}

/* Dark mode support */
.app-dark .layout-topbar-wrapper {
    background: var(--p-surface-900);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>