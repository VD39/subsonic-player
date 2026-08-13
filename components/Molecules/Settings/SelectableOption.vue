<script setup lang="ts">
defineProps<{
  badge?: string;
  description?: string;
  selected: boolean;
  title: string;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    :aria-checked="selected"
    :class="[
      $style.selectableOption,
      {
        [$style.selected]: selected,
      },
    ]"
    role="radio"
    type="button"
    @click="$emit('click')"
  >
    <div :class="$style.status">
      <component :is="ICONS.check" :size="14" />
    </div>

    <div :class="$style.details">
      <div :class="['smallFont', 'strong', $style.title]">
        {{ title }}

        <span v-if="badge" ref="badge" :class="$style.badge">{{ badge }}</span>
      </div>

      <div
        v-if="description"
        ref="descriptionEl"
        :class="['smallFont', $style.description]"
      >
        {{ description }}
      </div>
    </div>
  </button>
</template>

<style module>
.selectableOption {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: var(--space-8) var(--space-12);
  margin: 0 calc(-1 * var(--space-12));
  text-align: left;
  cursor: pointer;
  border-radius: var(--border-radius-large);
  transition: background-color var(--transition);

  &:hover {
    background-color: var(--hover-selected-color);
  }
}

.selected {
  cursor: default;

  &:hover {
    background-color: unset;
  }
}

.status {
  display: flex;
  visibility: hidden;
  flex-shrink: 0;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: var(--space-8);
  color: var(--background-color);
  background-color: var(--theme-color);
  border-radius: var(--border-radius-round);
  opacity: 0;
  transition:
    opacity var(--transition),
    visibility var(--transition);

  .selected & {
    visibility: visible;
    opacity: 1;
  }
}

.details {
  flex: 1;
}

.title {
  color: var(--body-font-color);
}

.badge {
  margin-left: var(--space-2);
  color: var(--secondary-font-color);
}

.description {
  margin-top: var(--space-2);
  line-height: var(--line-height-medium);
  color: var(--secondary-font-color);
}
</style>
