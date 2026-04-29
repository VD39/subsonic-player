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

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');
const dropdownListRef = useTemplateRef('dropdownListRef');

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

defineExpose({
  openDropdownMenu,
});
</script>

<template>
  <div ref="dropdownMenuRef" class="centerItems dropdownWrapper">
    <ButtonLink
      :class="$style.buttonLink"
      :icon
      iconPosition="right"
      :showText
      :title
      @click="toggleDropdownMenu"
    >
      <template v-if="$slots.icon" #icon>
        <slot name="icon" />
      </template>

      {{ text }}
    </ButtonLink>

    <Teleport to="#teleports">
      <transition name="fade">
        <div
          v-if="isOpen"
          ref="dropdownListRef"
          :class="['backdrop', 'dropdownOverlay', $style.dropdown]"
          :style="menuStyle"
        >
          <ul
            :class="[
              'hasPointerEvents',
              'dropdownContent',
              $style.dropdownContent,
            ]"
          >
            <slot />
          </ul>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style module>
.buttonLink {
  text-transform: uppercase;
}

.dropdown {
  @media (--mobile-only) {
    inset: auto var(--space-12) calc(var(--header-height) + var(--space-12)) !important;
  }

  @media (--tablet-up) {
    inset: auto;
  }
}

.dropdownContent {
  max-height: 70vh;
  overflow-x: auto;

  @media (--tablet-up) {
    max-height: 90vh;
  }
}
</style>
