<script setup lang="ts">
defineProps<{
  icon: string;
}>();
</script>

<template>
  <div :class="$style.defaultImage">
    <component :is="icon" ref="iconComponent" :class="$style.icon" />
  </div>
</template>

<style module>
.defaultImage {
  position: relative;
  display: block;
  width: 0;
  height: 0;
  padding-top: 100%;
  padding-left: 100%;
  background-color: var(--secondary-background-color);
  border-radius: var(--border-radius-medium);
}

.icon {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 100%;
  max-width: 45px;
  height: 100%;
  transform: translate(-50%, -50%);
}
</style>
