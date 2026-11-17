<script setup lang="ts">
import BaseIcon from '@/components/ui/BaseIcon.vue';

defineProps<{
  icon: Icon;
  message: string;
}>();
</script>

<template>
  <div :class="['column', 'centerAll', $style.noMediaMessage]">
    <BaseIcon :icon :size="50" />

    <p>{{ message }}</p>
  </div>
</template>

<style module>
.noMediaMessage {
  flex: 1;
}
</style>
