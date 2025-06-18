<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const { repeat, setRepeat } = useAudioPlayer();

const buttonProps = computed<ButtonProps>(() => {
  const noRepeat = repeat.value === -1;

  return {
    icon: repeat.value === 1 ? ICONS.repeatOnce : ICONS.repeat,
    iconColor: noRepeat ? 'currentColor' : 'var(--theme-color)',
    iconWeight: noRepeat ? 'regular' : 'fill',
  };
});

const title = computed(() => {
  switch (repeat.value) {
    case -1:
      return 'Turn on repeat all';
    case Number.POSITIVE_INFINITY:
      return 'Turn on repeat one';
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
    @click="setRepeat"
  >
    {{ title }}
  </ButtonLink>
</template>
