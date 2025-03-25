<script setup lang="ts">
defineProps<{
  type: SnackType;
}>();
</script>

<template>
  <div
    :class="[
      'strong',
      'smallFont',
      'centerItems',
      'spaceBetween',
      type,
      $style.messageBar,
    ]"
  >
    <slot />
  </div>
</template>

<style module>
.messageBar {
  gap: var(--default-space);
  width: var(--width-height-100);
  padding: var(--default-space) var(--default-space) var(--default-space)
    calc(var(--default-space) * 2);
  color: var(--white-color);
  word-break: normal;
  word-wrap: break-word;
  overflow-wrap: anywhere;
  border-radius: var(--border-radius-small);
}
</style>
