<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app';

import MainLoader from '@/components/Atoms/MainLoader.vue';

const props = defineProps<{
  status: AsyncDataRequestStatus;
}>();

const showLoader = computed(() => props.status === 'pending');
</script>

<template>
  <div
    v-show="showLoader"
    ref="mainLoader"
    :class="['column', 'centerAll', $style.loadingData]"
  >
    <MainLoader />
  </div>

  <div
    v-show="!showLoader"
    ref="mainContent"
    class="mainContent"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<style module>
.loadingData {
  position: relative;
  flex: 1;
}
</style>
