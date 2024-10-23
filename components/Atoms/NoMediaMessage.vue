<script setup lang="ts">
defineProps<{
  icon: string;
  message: string;
}>();
</script>

<template>
  <div :class="$style.noMediaMessage">
    <div :class="['column', 'centerItems', $style.content]">
      <component :is="icon" :size="50" />

      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style module>
.noMediaMessage {
  position: relative;
  height: var(--width-height-100);
}

.content {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
}
</style>
