<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppMenuItem from './AppMenuItem.vue';

const route = useRoute();
const routePath = ref(route.path);

// Watch for route changes
watch(
    () => route.path,
    (newPath) => {
        console.log('Route changed to:', newPath);
        routePath.value = newPath;
    }
);

// Log on mount
onMounted(() => {
    console.log('AppMenu mounted, path:', route.path);
});

// Determine which system we're in based on the route
const currentSystem = computed(() => {
    const path = routePath.value;
    console.log('Current path:', path);
    if (path.startsWith('/acsp')) {
        console.log('Current system: acsp');
        return 'acsp';
    } else if (path.startsWith('/medhandover')) {
        console.log('Current system: medhandover');
        return 'medhandover';
    }
    console.log('Current system: null');
    return null;
});

// Define menu items for each system (synced with topbar)
const acspMenuItems = [
    {
        label: 'ACSP',
        items: [
            { label: 'New Admit Patient List', icon: 'pi pi-fw pi-users', to: '/acsp/newPatients' },
            { label: 'Long Stay Patient List', icon: 'pi pi-fw pi-users', to: '/acsp/longStayPatients' },
            { label: 'Provider List', icon: 'pi pi-fw pi-user-edit', to: '/acsp/providers' }
        ]
    },
];

const medHandoverMenuItems = [
    {
        label: 'Medical Handover',
        items: [
            { label: 'Handover List', icon: 'pi pi-fw pi-list', to: '/medhandover' },
        ]
    },
    
];


// Compute the menu items based on the current system
const menuItems = computed(() => {
    console.log('Computing menu items, current system:', currentSystem.value);
    if (currentSystem.value === 'acsp') {
        console.log('Returning ACSP menu items');
        return acspMenuItems;
    } else if (currentSystem.value === 'medhandover') {
        console.log('Returning MedHandover menu items');
        return medHandoverMenuItems;
    }
    console.log('Returning common menu items');
    return acspMenuItems;
});

</script>

<template>
   <ul class="layout-menu">
        <template v-for="(item, i) in menuItems" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>