<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: string;
  }>(),
  {
    rows: '5',
  },
);
</script>

<template>
  <section :class="$style.mediaListWrapper" :style="{ '--loop-rows': rows }">
    <slot />
  </section>
</template>

<style module>
.mediaListWrapper {
  --loop-cols: calc(
    (var(--loop-max-width) - (var(--loop-columns) - 1) * var(--loop-grid-gap)) /
      var(--loop-columns)
  );

  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--loop-cols), 1fr));
  gap: var(--loop-grid-gap);
  list-style: none;

  @media (width >= 420px) {
    --loop-columns: max(var(--loop-rows) - 3, 2);
  }

  @media (width >= 775px) {
    --loop-columns: max(var(--loop-rows) - 2, 2);
  }

  @media (width >= 1000px) {
    --loop-columns: max(var(--loop-rows) - 1, 2);
  }

  @media (width >= 1260px) {
    --loop-columns: var(--loop-rows);
  }
}
</style>
