<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: string;
    iconPosition?: IconPosition;
    iconSize?: number;
    is?: ButtonType;
    showText?: boolean;
    type?: string;
  }>(),
  {
    disabled: undefined,
    icon: undefined,
    iconPosition: 'left',
    iconSize: 20,
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
    <component
      :is="icon"
      v-if="icon"
      ref="phIcon"
      :class="$style.icon"
      aria-hidden="true"
      :size="iconSize"
      weight="duotone"
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
  fill: var(--body-font-color);

  [opacity='0.2'] {
    opacity: 0.4;
    fill: var(--secondary-font-color);
  }
}

.text {
  display: block;
  margin-bottom: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
