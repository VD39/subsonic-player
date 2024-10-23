<script setup lang="ts">
defineProps<{
  icon: Image;
}>();
</script>

<template>
  <div :class="$style.iconImage">
    <component :is="icon" ref="iconComponent" :class="$style.icon" />
  </div>
</template>

<style module>
.iconImage {
  --icon-image-width-height: var(--width-height-100);
  --icon-image-padding: 100%;

  position: relative;
  display: block;
  width: var(--icon-image-width-height);
  height: var(--icon-image-width-height);
  aspect-ratio: 1;
  padding-top: var(--icon-image-padding);
  padding-left: var(--icon-image-padding);
  background-color: var(--secondary-background-color);
  border-radius: var(--border-radius-medium);
}

.icon {
  position: absolute;
  inset: 50% auto auto 50%;
  width: var(--icon-image-width-height);
  max-width: 45%;
  height: var(--icon-image-width-height);
  transform: translate(-50%, -50%);
}
</style>
