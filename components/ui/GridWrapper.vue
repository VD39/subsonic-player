<script setup lang="ts">
withDefaults(
  defineProps<{
    desktopColumns?: string;
    mobileColumns?: string;
    spacing?: string;
    tabletColumns?: string;
  }>(),
  {
    desktopColumns: '5',
    mobileColumns: '2',
    spacing: '24',
    tabletColumns: '3',
  },
);
</script>

<template>
  <section
    :class="$style.mediaListWrapper"
    :style="{
      '--loop-rows-mobile': mobileColumns,
      '--loop-rows-tablet': tabletColumns,
      '--loop-rows-desktop': desktopColumns,
      '--loop-grid-gap': `${spacing}px`,
    }"
  >
    <slot />
  </section>
</template>

<style module>
.mediaListWrapper {
  --loop-columns: var(--loop-rows-mobile);

  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--loop-columns), 1fr);
  gap: var(--loop-grid-gap);

  @media (--tablet-up) {
    --loop-columns: var(--loop-rows-tablet);
  }

  @media (width >= 1100px) {
    --loop-columns: var(--loop-rows-desktop);
  }
}
</style>
