<script setup lang="ts">
import type { IconName, SizeProp } from '@fortawesome/fontawesome-svg-core';
import type { ButtonType, IconPosition } from './types';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    icon?: IconName;
    iconPosition?: IconPosition;
    iconSize?: SizeProp;
    is?: ButtonType;
    showText?: boolean;
    type?: string;
  }>(),
  {
    disabled: undefined,
    icon: undefined,
    iconPosition: 'left',
    iconSize: 'lg',
    is: 'button',
    type: 'button',
  },
);

const type = props.is === 'button' ? props.type : undefined;
const isComponent =
  props.is === 'nuxt-link' ? resolveComponent('NuxtLink') : props.is;
</script>

<template>
  <component
    :is="isComponent"
    :class="[
      $style.iconButton,
      {
        [$style.alignRight]: icon && iconPosition === 'right',
        [$style.disabled]: disabled,
      },
    ]"
    :disabled="disabled"
    :type="type"
    v-bind="$attrs"
  >
    <font-awesome-icon
      v-if="icon"
      aria-hidden="true"
      :icon="['fas', icon]"
      :size="iconSize"
    />

    <span
      ref="text"
      :class="[
        {
          'visually-hidden': !showText,
        },
      ]"
    >
      <slot />
    </span>
  </component>
</template>

<style module>
.iconButton {
  @mixin align-center;

  position: relative;
  gap: var(--space-8);
  padding: var(--space-8);
  margin: 0;
}

.alignRight {
  flex-direction: row-reverse;
}

.disabled {
  pointer-events: none;
  opacity: 0.25;
}
</style>
