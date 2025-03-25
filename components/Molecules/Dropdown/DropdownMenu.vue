<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

withDefaults(
  defineProps<{
    icon?: Icon;
    showText?: boolean;
    text?: string;
    title?: string;
  }>(),
  {
    icon: ICONS.dropdownMenu,
    text: 'More',
    title: 'More',
  },
);

const emit = defineEmits<{
  closed: [];
  opened: [];
}>();

const isOpen = ref(false);
const showAbove = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownMenuRef = ref<HTMLElement | null>(null);

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false;

    window.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKeydown);
  }
}

function onClick(event: MouseEvent) {
  if (
    !dropdownMenuRef.value?.contains(event.target as Node) ||
    dropdownRef.value?.contains(event.target as Node)
  ) {
    isOpen.value = false;

    emit('closed');

    window.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKeydown);
  }
}

function checkIfOutsideScreen() {
  if (!dropdownRef.value) {
    return;
  }

  const dropdownHeight = dropdownRef.value.clientHeight;
  const windowHeight = window.innerHeight;
  const dropdownTop = dropdownRef.value.getBoundingClientRect().top;

  showAbove.value = windowHeight - dropdownTop < dropdownHeight;
}

async function toggleDropdown() {
  showAbove.value = false;
  isOpen.value = !isOpen.value;

  await nextTick();

  if (isOpen.value) {
    emit('opened');

    window.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);

    checkIfOutsideScreen();
    return;
  }

  emit('closed');
}
</script>

<template>
  <div ref="dropdownMenuRef" :class="['centerItems', $style.dropdownMenu]">
    <ButtonLink
      :class="$style.buttonLink"
      :icon="icon"
      icon-position="right"
      :show-text="showText"
      :title="title"
      @click="toggleDropdown"
    >
      {{ text }}
    </ButtonLink>

    <transition name="fade">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        :class="[
          $style.dropdown,
          {
            [$style.above]: showAbove,
          },
        ]"
      >
        <ul>
          <slot />
        </ul>
      </div>
    </transition>
  </div>
</template>

<style module>
.dropdownMenu {
  position: relative;
}

.dropdown {
  --dropdown-position: fixed;

  position: var(--dropdown-position);
  inset: auto var(--space-12) calc(var(--header-height) + var(--space-12));
  z-index: 12;
  min-width: 180px;
  padding: var(--space-4) 0;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--dark-box-shadow-medium);

  &::after {
    position: fixed;
    inset: 0;
    z-index: -1;
    content: '';
    background-color: var(--black-color);
    opacity: 0.15;
  }

  @media (--tablet-up) {
    --dropdown-position: absolute;

    inset: 100% 0 auto auto;
  }
}

.above {
  inset: auto 0 100% auto;
}

.buttonLink {
  text-transform: uppercase;
}
</style>
