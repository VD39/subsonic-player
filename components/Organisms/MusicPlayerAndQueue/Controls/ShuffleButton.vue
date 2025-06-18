<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { shuffle, toggleShuffle } = useAudioPlayer();

const buttonProps = computed<ButtonProps>(() => ({
  iconColor: shuffle.value ? 'var(--theme-color)' : 'currentColor',
  iconWeight: shuffle.value ? 'fill' : 'regular',
  text: `Switch shuffle ${shuffle.value ? 'on' : 'off'}`,
}));
</script>

<template>
  <ButtonLink
    :icon="ICONS.shuffle"
    :iconColor="buttonProps.iconColor"
    :iconWeight="buttonProps.iconWeight"
    :title="buttonProps.text"
    @click="toggleShuffle"
  >
    {{ buttonProps.text }}
  </ButtonLink>
</template>
