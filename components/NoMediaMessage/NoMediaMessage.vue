<script setup lang="ts">
defineProps<{
  icon: string;
  message: string;
}>();
</script>

<template>
  <div :class="$style.noMediaMessage">
    <div :class="$style.content">
      <component :is="icon" :size="50" />

      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style module>
.noMediaMessage {
  position: relative;
  height: 100%;
}

.content {
  @mixin align-center;

  position: absolute;
  inset: 50% auto auto 50%;
  flex-direction: column;
  transform: translate(-50%, -50%);
}
</style>
