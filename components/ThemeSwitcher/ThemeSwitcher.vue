<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';
const { isDarkTheme, toggleTheme } = useTheme();

const text = computed(() => {
  const mode = isDarkTheme.value ? 'light' : 'dark';
  return `Activate ${mode} mode`;
});
</script>

<template>
  <client-only>
    <IconButton
      :icon="isDarkTheme ? 'PhSun' : 'PhMoon'"
      :title="text"
      @click="toggleTheme"
    >
      {{ text }}
    </IconButton>
  </client-only>
</template>
