<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: Component | string;
    iconColor?: string;
    iconPosition?: IconPosition;
    iconSize?: number;
    iconWeight?: IconWeight;
    is?: ButtonLink;
    showText?: boolean;
    type?: string;
  }>(),
  {
    disabled: undefined,
    icon: undefined,
    iconColor: undefined,
    iconPosition: 'left',
    iconSize: 24,
    iconWeight: 'duotone',
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
      'centerItems',
      $style.buttonLink,
      {
        [$style.alignRight]: icon && iconPosition === 'right',
        [$style.disabled]: disabled,
        [`centerAll ${$style.fullWidth}`]: fullWidth,
      },
    ]"
    :disabled="disabled"
    :type="type"
    v-bind="$attrs"
  >
    <component
      :is="icon"
      v-if="icon"
      ref="iconComponent"
      :class="$style.icon"
      aria-hidden="true"
      :size="iconSize"
      :weight="iconWeight"
      :color="iconColor"
    />

    <span
      ref="text"
      :class="[
        'clamp',
        $style.text,
        {
          visuallyHidden: !showText,
        },
      ]"
    >
      <slot />
    </span>
  </component>
</template>

<style module>
.buttonLink {
  position: relative;
  gap: var(--default-space);
  padding: var(--default-space);
  white-space: nowrap;
}

.alignRight {
  flex-direction: row-reverse;
}

.fullWidth {
  width: var(--width-height-100);
}

.disabled {
  pointer-events: none;
  opacity: 0.25;
}

.icon {
  flex-shrink: 0;

  [opacity='0.2'] {
    opacity: 0.4;
    fill: var(--secondary-font-color);
  }
}

.text {
  display: block;
  margin-bottom: 1px;
}
</style>
