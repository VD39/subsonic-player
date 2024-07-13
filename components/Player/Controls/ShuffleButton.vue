<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { shuffle, toggleShuffle } = useAudioPlayer();

const buttonProps = computed<ShuffleButtonProps>(() => ({
  iconColor: shuffle.value ? 'var(--theme-color)' : 'currentColor',
  iconWeight: shuffle.value ? 'fill' : 'duotone',
  title: `Switch shuffle ${shuffle.value ? 'on' : 'off'}`,
}));
</script>

<template>
  <IconButton
    icon="PhShuffle"
    :icon-color="buttonProps.iconColor"
    :icon-weight="buttonProps.iconWeight"
    :title="buttonProps.title"
    @click="toggleShuffle"
  >
    {{ buttonProps.title }}
  </IconButton>
</template>
