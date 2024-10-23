<script setup lang="ts">
import MainLoader from '@/components/Atoms/MainLoader.vue';

const loading = useLoading();
</script>

<template>
  <div v-show="loading" ref="mainLoader">
    <MainLoader />
  </div>

  <div v-show="!loading" ref="mainContent" class="mBAllL">
    <slot />
  </div>
</template>
