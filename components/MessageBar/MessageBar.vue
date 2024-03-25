<script setup lang="ts">
import type { SnackType } from './types';

defineProps<{
  type: SnackType;
}>();
</script>

<template>
  <div :class="[$style[type], $style.messageBar]">
    <slot />
  </div>
</template>

<style module>
.messageBar {
  @mixin align-center;

  gap: var(--space-12);
  justify-content: space-between;
  width: 100%;
  padding: var(--space-8);
  border-radius: var(--border-radius-s);

  > * {
    font-size: var(--small-font-size);
    color: var(--white-color);
  }
}

.success {
  background-color: var(--success-color);
}

.error {
  background-color: var(--error-color);
}

.info {
  background-color: var(--info-color);
}
</style>
