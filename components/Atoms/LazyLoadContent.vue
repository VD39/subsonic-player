<script setup lang="ts">
const rootRef = useTemplateRef('rootRef');

const loadSlot = ref(false);
const intersectionObserver = ref<IntersectionObserver | null>(null);

onMounted(() => {
  if (!rootRef.value) {
    return;
  }

  intersectionObserver.value = new IntersectionObserver(
    ([entry], observer) => {
      if (entry && entry.isIntersecting) {
        loadSlot.value = true;
        observer.disconnect();
      }
    },
    {
      root: null,
      threshold: 0.1,
    },
  );

  intersectionObserver.value.observe(rootRef.value);
});

onUnmounted(() => {
  intersectionObserver.value?.disconnect();
});
</script>

<template>
  <div ref="rootRef" :class="$style.lazyLoadContent">
    <div
      v-if="!loadSlot"
      ref="loading"
      :class="['skeletonLoader', $style.preloadImage]"
    >
      <span class="visuallyHidden">Loading data</span>
    </div>

    <slot v-else />
  </div>
</template>

<style module>
.lazyLoadContent {
  height: inherit;
}

.preloadImage {
  position: relative;
  width: var(--width-height-100);
  height: inherit;
}
</style>
