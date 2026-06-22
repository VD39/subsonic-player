<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { isDarkTheme, toggleTheme } = useTheme();

const buttonProps = computed(() => ({
  icon: isDarkTheme.value ? ICONS.switchToLightTheme : ICONS.switchToDarkTheme,
  text: `Activate ${isDarkTheme.value ? 'light' : 'dark'} mode`,
}));
</script>

<template>
  <ClientOnly>
    <ButtonLink
      :icon="buttonProps.icon"
      :title="buttonProps.text"
      @click="toggleTheme"
    >
      {{ buttonProps.text }}
    </ButtonLink>
  </ClientOnly>
</template>
