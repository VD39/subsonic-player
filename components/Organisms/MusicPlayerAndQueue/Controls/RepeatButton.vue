<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { cycleRepeat, repeat } = useAudioPlayer();

const buttonProps = computed<ButtonProps>(() => {
  const noRepeat = repeat.value === REPEAT_MODE.off;

  return {
    icon: repeat.value === REPEAT_MODE.one ? ICONS.repeatOnce : ICONS.repeat,
    iconColor: noRepeat ? 'currentColor' : 'var(--theme-color)',
    iconWeight: noRepeat ? 'regular' : 'fill',
  };
});

const title = computed(() => {
  switch (repeat.value) {
    case REPEAT_MODE.all:
      return 'Turn on repeat one';
    case REPEAT_MODE.off:
      return 'Turn on repeat all';
    default:
      return 'Turn repeat off';
  }
});
</script>

<template>
  <ButtonLink
    :icon="buttonProps.icon"
    :iconColor="buttonProps.iconColor"
    :iconWeight="buttonProps.iconWeight"
    :title
    @click="cycleRepeat"
  >
    {{ title }}
  </ButtonLink>
</template>
