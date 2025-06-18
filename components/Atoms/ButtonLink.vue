<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: Component | Icon;
    iconColor?: string;
    iconPosition?: IconPosition;
    iconSize?: IconSize;
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
    iconSize: 'medium',
    iconWeight: 'regular',
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
        'centerAll fullWidth': fullWidth,
      },
    ]"
    :disabled
    draggable="false"
    :type
    v-bind="$attrs"
  >
    <component
      :is="icon"
      v-if="icon"
      ref="iconComponent"
      aria-hidden="true"
      :class="$style.icon"
      :color="iconColor"
      :size="ICON_SIZE[iconSize]"
      :weight="iconWeight"
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
