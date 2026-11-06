<script setup lang="ts">
import ButtonLink from '@/components/ui/ButtonLink.vue';

const { isDarkTheme, toggleTheme } = useSettings();

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
