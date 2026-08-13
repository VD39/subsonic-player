<script setup lang="ts">
const props = defineProps<{
  type: SnackType;
}>();

const roleType = computed(() => (props.type === 'error' ? 'alert' : 'status'));
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
    :role="roleType"
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
  overflow-wrap: anywhere;
  border-radius: var(--border-radius-small);
}
</style>
