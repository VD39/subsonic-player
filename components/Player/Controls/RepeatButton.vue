<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { repeat, setRepeat } = useAudioPlayer();

const buttonProps = computed<RepeatButtonProps>(() => {
  const noRepeat = repeat.value === -1;

  return {
    icon: repeat.value === 1 ? 'PhRepeatOnce' : 'PhRepeat',
    iconColor: noRepeat ? 'currentColor' : 'var(--theme-color)',
    iconWeight: noRepeat ? 'duotone' : 'fill',
  };
});

const title = computed(() => {
  switch (repeat.value) {
    case -1:
      return 'Turn on repeat all.';
    case Number.POSITIVE_INFINITY:
      return 'Turn on repeat one.';
    default:
      return 'Turn repeat off.';
  }
});
</script>

<template>
  <IconButton
    :icon="buttonProps.icon"
    :icon-color="buttonProps.iconColor"
    :icon-weight="buttonProps.iconWeight"
    :title="title"
    @click="setRepeat"
  >
    {{ title }}
  </IconButton>
</template>
