<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { isDarkTheme, toggleTheme } = useTheme();

const buttonProps = computed(() => ({
  icon: isDarkTheme.value ? ICONS.darkTheme : ICONS.lightTheme,
  text: `Activate ${isDarkTheme.value ? 'light' : 'dark'} mode`,
}));
</script>

<template>
  <client-only>
    <ButtonLink
      :icon="buttonProps.icon"
      :title="buttonProps.text"
      @click="toggleTheme"
    >
      {{ buttonProps.text }}
    </ButtonLink>
  </client-only>
</template>
