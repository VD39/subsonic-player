<script setup lang="ts">
import MainLoader from '@/components/Atoms/MainLoader.vue';

const loading = useLoading();
</script>

<template>
  <div
    v-show="loading"
    ref="mainLoader"
    :class="['column', 'centerAll', $style.loadingData]"
  >
    <MainLoader />
  </div>

  <div v-show="!loading" ref="mainContent" class="mainContent">
    <slot />
  </div>
</template>

<style module>
.loadingData {
  position: relative;
  flex: 1;
}
</style>
