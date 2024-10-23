<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

withDefaults(
  defineProps<{
    is?: ButtonLink;
    selected?: boolean;
  }>(),
  {
    is: undefined,
  },
);

defineEmits(['click']);
</script>

<template>
  <li :class="$style.dropdownItem">
    <ButtonLink
      :is="is"
      :class="[
        'spaceBetween',
        $style.buttonLink,
        {
          [$style.selected]: selected,
        },
      ]"
      show-text
      icon-position="right"
      full-width
      v-bind="$attrs"
      @click="$emit('click')"
    >
      <slot />
    </ButtonLink>
  </li>
</template>

<style module>
.dropdownItem {
  display: flex;
}

.buttonLink {
  --button-hover-color: transparent;

  padding: var(--default-space);
  background-color: var(--button-hover-color);

  &:hover {
    --button-hover-color: var(--hover-selected-color);
  }
}

.selected {
  --button-hover-color: var(--hover-selected-color);
}
</style>
