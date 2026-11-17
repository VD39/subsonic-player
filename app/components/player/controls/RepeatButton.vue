<script setup lang="ts">
import ButtonLink from '@/components/ui/ButtonLink.vue';

const { cycleRepeat, repeat } = useAudioPlayer();

const buttonProps = computed<ButtonProps>(() => {
  const noRepeat = repeat.value === REPEAT_MODE.off;

  return {
    icon: repeat.value === REPEAT_MODE.one ? ICONS.repeatOnce : ICONS.repeat,
    iconStroke: noRepeat ? 'currentColor' : 'var(--theme-color)',
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
    :iconStroke="buttonProps.iconStroke"
    :title
    @click="cycleRepeat"
  >
    {{ title }}
  </ButtonLink>
</template>
