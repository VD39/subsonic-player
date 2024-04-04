<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

defineEmits(['click']);

withDefaults(
  defineProps<{
    is?: ButtonType;
  }>(),
  {
    is: 'nuxt-link',
  },
);
</script>

<template>
  <li :class="$style.dropdownItem">
    <IconButton
      :is="is"
      :class="$style.action"
      show-text
      icon-position="right"
      full-width
      v-bind="$attrs"
      @click="$emit('click')"
    >
      <slot />
    </IconButton>
  </li>
</template>

<style module>
.dropdownItem {
  display: flex;
}

.action {
  justify-content: space-between;
  padding: var(--space-8) var(--space-12);

  &:hover {
    background-color: var(--hover-selected-color);
  }
}
</style>
