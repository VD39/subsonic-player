<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

defineProps<{
  icon?: Icon;
  is?: 'span' | ButtonLinkIs;
  selected?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <li :class="$style.dropdownItem">
    <span
      v-if="is === 'span'"
      ref="spanElement"
      :class="[$style.spanItem, $style.item]"
    >
      <slot />
    </span>

    <ButtonLink
      :is
      v-else
      :class="[
        'spaceBetween',
        $style.item,
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
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

.spanItem {
  width: var(--width-height-100);
}

.item {
  --button-hover-color: transparent;

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
