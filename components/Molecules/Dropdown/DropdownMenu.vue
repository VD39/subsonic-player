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

const dropdownListRef = useTemplateRef('dropdownListRef');
const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

const { closeDropdownMenu, isOpen, menuStyle, openDropdownMenu } =
  useDropdownMenu({
    dropdownListRef,
    dropdownMenuRef,
  });

function toggleDropdownMenu() {
  if (isOpen.value) {
    closeDropdownMenu();
  } else {
    openDropdownMenu();
  }
}

watch(isOpen, (isDropdownOpen) => {
  if (isDropdownOpen) {
    emit('opened');
  } else {
    emit('closed');
  }
});

defineExpose({
  openDropdownMenu,
});
</script>

<template>
  <div ref="dropdownMenuRef" :class="['centerItems', $style.dropdownMenu]">
    <ButtonLink
      :class="$style.buttonLink"
      :icon
      iconPosition="right"
      :showText
      :title
      @click="toggleDropdownMenu"
    >
      {{ text }}
    </ButtonLink>

    <transition name="fade">
      <div
        v-if="isOpen"
        ref="dropdownListRef"
        :class="['backdrop', $style.dropdown]"
        :style="menuStyle"
      >
        <ul class="hasPointerEvents">
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

.buttonLink {
  text-transform: uppercase;
}

.dropdown {
  position: fixed;
  z-index: 12;
  min-width: 180px;
  padding: var(--space-4) 0;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--dark-box-shadow-medium);

  @media (--mobile-only) {
    inset: auto var(--space-12) calc(var(--header-height) + var(--space-12)) !important;
  }

  @media (--tablet-up) {
    inset: auto;
  }
}
</style>
