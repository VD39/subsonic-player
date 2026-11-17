<script setup lang="ts">
import ButtonLink from '@/components/ui/ButtonLink.vue';

const { shuffle, toggleShuffle } = useAudioPlayer();

const buttonProps = computed<ButtonProps>(() => ({
  iconStroke: shuffle.value ? 'var(--theme-color)' : 'currentColor',
  text: `Switch shuffle ${shuffle.value ? 'off' : 'on'}`,
}));
</script>

<template>
  <ButtonLink
    :icon="ICONS.shuffle"
    :iconStroke="buttonProps.iconStroke"
    :title="buttonProps.text"
    @click="toggleShuffle"
  >
    {{ buttonProps.text }}
  </ButtonLink>
</template>
