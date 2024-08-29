<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

withDefaults(
  defineProps<{
    icon?: string;
    text?: string;
    title?: string;
    showText?: boolean;
  }>(),
  {
    icon: 'PhDotsThreeVertical',
    text: 'More',
    title: 'More',
  },
);

const emit = defineEmits(['opened', 'closed']);

const isOpen = ref(false);
const showAbove = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownMenuRef = ref<HTMLElement | null>(null);

function keydownHandler(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false;

    window.removeEventListener('click', handleClick);
    document.removeEventListener('keydown', keydownHandler);
  }
}

function checkIfOutsideScreen() {
  if (!dropdownMenuRef.value) {
    return;
  }

  const dropdownHeight = dropdownMenuRef.value.clientHeight;
  const windowHeight = window.innerHeight;
  const dropdownTop = dropdownMenuRef.value.getBoundingClientRect().top;

  showAbove.value = windowHeight - dropdownTop < dropdownHeight;
}

async function toggleDropdown() {
  showAbove.value = false;
  isOpen.value = !isOpen.value;

  await nextTick();

  if (isOpen.value) {
    emit('opened');

    window.addEventListener('click', handleClick);
    document.addEventListener('keydown', keydownHandler);

    checkIfOutsideScreen();
    return;
  }

  emit('closed');
}

function handleClick(event: MouseEvent) {
  if (
    !dropdownRef.value?.contains(event.target as Node) ||
    dropdownMenuRef.value?.contains(event.target as Node)
  ) {
    isOpen.value = false;

    emit('closed');

    window.removeEventListener('click', handleClick);
    document.removeEventListener('keydown', keydownHandler);
  }
}
</script>

<template>
  <div ref="dropdownRef" :class="$style.dropdown">
    <IconButton
      :icon="icon"
      :class="$style.button"
      :show-text="showText"
      icon-position="right"
      :title="title"
      @click="toggleDropdown"
    >
      {{ text }}
    </IconButton>

    <transition name="fade">
      <div
        v-if="isOpen"
        ref="dropdownMenuRef"
        :class="[
          $style.dropdownMenu,
          {
            [$style.above]: showAbove,
          },
        ]"
      >
        <ul :class="$style.menu">
          <slot />
        </ul>
      </div>
    </transition>
  </div>
</template>

<style module>
.dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.dropdownMenu {
  position: fixed;
  inset: auto var(--space-12) calc(var(--header-height) + var(--space-12));
  z-index: 10;
  min-width: 180px;
  padding: var(--space-4) 0;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--dark-box-shadow-medium);

  @media (--tablet-up) {
    position: absolute;
    inset: 100% 0 auto auto;

    &.above {
      inset: auto 0 100% auto;
    }
  }
}

.button {
  text-transform: uppercase;
}

.menu {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
