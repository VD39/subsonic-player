<script setup lang="ts">
import ImageLoader from '@/components/Loaders/ImageLoader.vue';

withDefaults(
  defineProps<{
    src: string;
    alt?: string;
  }>(),
  {
    alt: 'Image',
  },
);

const isLoading = ref(true);

function onImageLoad() {
  isLoading.value = false;
}
</script>

<template>
  <div :class="$style.preloadImage">
    <div v-show="isLoading" ref="placeholder">
      <span :class="$style.placeholder" />

      <ImageLoader />
    </div>

    <img
      v-show="!isLoading"
      ref="img"
      :src="src"
      :alt="alt"
      @load="onImageLoad"
    />
  </div>
</template>

<style module>
.preloadImage {
  position: relative;
  display: block;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.placeholder {
  display: block;
  width: 1000px;
  height: 1000px;
}
</style>
