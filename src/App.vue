<script setup>
import MsalAuthProvider from './auth/components/MsalAuthProvider.vue';
</script>

<template>
  <MsalAuthProvider>
    <router-view />
  </MsalAuthProvider>
</template>

