<script setup lang="ts">
defineProps<{
  icon: Icon;
  message: string;
}>();
</script>

<template>
  <div :class="['column', 'centerAll', $style.noMediaMessage]">
    <component :is="icon" size="50" />

    <p>{{ message }}</p>
  </div>
</template>

<style module>
.noMediaMessage {
  flex: 1;
}
</style>
