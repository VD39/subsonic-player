<template>
  <li :class="$style.divider" aria-hidden="true" />
</template>

<style module>
.divider {
  width: var(--width-height-100);
  height: 0;
  margin: var(--space-4) 0;
  overflow: hidden;
  border-top: 1px solid var(--border-color);
}
</style>
