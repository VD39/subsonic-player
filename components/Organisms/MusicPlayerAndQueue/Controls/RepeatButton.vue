<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { cycleRepeat, repeat, resetRepeat } = useAudioPlayer();
const { deletePodcastOnEnd } = useSettings();

const buttonProps = computed<ButtonProps>(() => {
  const noRepeat = repeat.value === REPEAT_MODE.off;

  return {
    icon: repeat.value === REPEAT_MODE.one ? ICONS.repeatOnce : ICONS.repeat,
    iconColor: noRepeat ? 'currentColor' : 'var(--theme-color)',
    iconWeight: noRepeat ? 'regular' : 'fill',
  };
});

const title = computed(() => {
  if (deletePodcastOnEnd.value) {
    return 'Repeat is off while delete on end is enabled';
  }

  switch (repeat.value) {
    case REPEAT_MODE.all:
      return 'Turn on repeat one';
    case REPEAT_MODE.off:
      return 'Turn on repeat all';
    default:
      return 'Turn repeat off';
  }
});

watch(
  deletePodcastOnEnd,
  (enabled) => {
    if (enabled) {
      resetRepeat();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <ButtonLink
    :disabled="deletePodcastOnEnd"
    :icon="buttonProps.icon"
    :iconColor="buttonProps.iconColor"
    :iconWeight="buttonProps.iconWeight"
    :title
    @click="cycleRepeat"
  >
    {{ title }}
  </ButtonLink>
</template>
