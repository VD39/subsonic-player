<script setup lang="ts">
import BaseIcon from '@/components/ui/BaseIcon.vue';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: Component | Icon;
    iconFill?: string;
    iconPosition?: 'left' | 'right';
    iconSize?: IconSize;
    iconStroke?: string;
    is?: ButtonOrLinkType;
    showText?: boolean;
    type?: string;
  }>(),
  {
    disabled: undefined,
    icon: undefined,
    iconFill: undefined,
    iconPosition: 'left',
    iconSize: 'medium',
    iconStroke: undefined,
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
        [$style.alignRight]: ($slots.icon || icon) && iconPosition === 'right',
        [$style.disabled]: disabled,
        'centerAll fullWidth': fullWidth,
      },
    ]"
    :disabled
    draggable="false"
    :type
    v-bind="$attrs"
  >
    <slot name="icon">
      <BaseIcon
        v-if="icon"
        aria-hidden="true"
        :class="$style.icon"
        :fill="iconFill"
        :icon
        :size="ICON_SIZE[iconSize]"
        :stroke="iconStroke"
      />
    </slot>

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
}

.text {
  display: block;
  margin-bottom: 1px;
}
</style>
