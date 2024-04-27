<script setup lang="ts">
import type { IconName, SizeProp } from '@fortawesome/fontawesome-svg-core';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    fullWidth?: boolean;
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
    iconSize: 'sm',
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
        [$style.fullWidth]: fullWidth,
      },
    ]"
    :disabled="disabled"
    :type="type"
    v-bind="$attrs"
  >
    <font-awesome-icon
      v-if="icon"
      ref="icon"
      :class="$style.icon"
      aria-hidden="true"
      :icon="['fas', icon]"
      :size="iconSize"
      fixed-width
    />

    <span
      ref="text"
      :class="[
        $style.text,
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
  white-space: nowrap;
}

.alignRight {
  flex-direction: row-reverse;
}

.fullWidth {
  width: 100%;
}

.disabled {
  pointer-events: none;
  opacity: 0.25;
}

.icon {
  flex-shrink: 0;
}

.text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
