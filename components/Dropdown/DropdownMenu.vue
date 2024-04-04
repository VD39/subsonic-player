<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const emit = defineEmits(['opened', 'closed']);

withDefaults(
  defineProps<{
    text?: string;
    title?: string;
    showText?: boolean;
  }>(),
  {
    text: 'More',
    title: 'More',
  },
);

const isOpen = ref(false);
const dropdown = ref<HTMLElement | null>(null);

function keydownHandler(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isOpen.value = false;
  }
}

function toggleDropdown() {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    emit('opened');

    window.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', keydownHandler);
    return;
  }

  emit('closed');
}

function handleClickOutside(event: MouseEvent) {
  if (!dropdown.value?.contains(event.target as Node)) {
    isOpen.value = false;

    window.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', keydownHandler);
  }
}
</script>

<template>
  <div ref="dropdown" :class="$style.dropdown">
    <IconButton
      icon="ellipsis-vertical"
      :class="$style.button"
      :show-text="showText"
      icon-position="right"
      :title="title"
      @click="toggleDropdown"
    >
      {{ text }}
    </IconButton>

    <div v-if="isOpen" ref="dropdownMenu" :class="$style.dropdownMenu">
      <ul :class="$style.menu">
        <slot />
      </ul>
    </div>
  </div>
</template>

<style module>
.dropdown {
  position: relative;
  display: inline-flex;
}

.dropdownMenu {
  position: fixed;
  inset: auto var(--space-12) var(--space-12);
  z-index: 9;
  min-width: 180px;
  padding: var(--space-4) 0;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-m);
  box-shadow: var(--dark-box-shadow-medium);

  @media screen and (--tablet-up) {
    position: absolute;
    inset: 100% 0 auto auto;
  }
}

.button {
  @mixin align-center;

  position: relative;
  text-transform: uppercase;
}

.menu {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
