<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

defineProps<{
  icon?: Icon;
  is?: ButtonLink;
  selected?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <li :class="$style.dropdownItem">
    <ButtonLink
      :is
      :class="[
        'spaceBetween',
        $style.buttonLink,
        {
          [$style.selected]: selected,
        },
      ]"
      fullWidth
      :icon
      iconPosition="right"
      showText
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

  @media (hover: hover) {
    &:hover,
    &:focus {
      --button-hover-color: var(--hover-selected-color);
    }
  }
}

.selected {
  --button-hover-color: var(--hover-selected-color);
}
</style>
