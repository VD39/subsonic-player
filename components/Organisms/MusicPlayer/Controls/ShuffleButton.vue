<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { shuffle, toggleShuffle } = useAudioPlayer();

const buttonProps = computed<ButtonProps>(() => ({
  iconColor: shuffle.value ? 'var(--theme-color)' : 'currentColor',
  iconWeight: shuffle.value ? 'fill' : 'duotone',
  title: `Switch shuffle ${shuffle.value ? 'on' : 'off'}`,
}));
</script>

<template>
  <ButtonLink
    :icon="ICONS.shuffle"
    :icon-color="buttonProps.iconColor"
    :icon-weight="buttonProps.iconWeight"
    :title="buttonProps.title"
    @click="toggleShuffle"
  >
    {{ buttonProps.title }}
  </ButtonLink>
</template>
