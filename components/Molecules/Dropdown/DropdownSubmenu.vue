<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

defineProps<{
  text: string;
}>();

const dropdownSubmenuRef = useTemplateRef('dropdownSubmenuRef');
const dropdownSubListRef = useTemplateRef('dropdownSubListRef');

const {
  isHoverDevice,
  isOpen,
  openedLeft,
  openSubmenu,
  submenuStyle,
  toggleInline,
} = useDropdownSubmenu({
  dropdownSubListRef,
  dropdownSubmenuRef,
});

const submenuToggleIcon = computed(() => {
  if (isHoverDevice.value) {
    return ICONS.dropdownSubmenuRight;
  }

  return isOpen.value ? ICONS.dropdownSubmenuUp : ICONS.dropdownSubmenuDown;
});

const transitionName = computed(() => {
  if (!isHoverDevice.value) {
    return '';
  }

  return openedLeft.value ? 'slide-in-left' : 'slide-in-right';
});
</script>

<template>
  <li
    ref="dropdownSubmenuRef"
    class="dropdownWrapper"
    @mouseenter="openSubmenu"
  >
    <ButtonLink
      class="spaceBetween"
      fullWidth
      :icon="submenuToggleIcon"
      iconPosition="right"
      showText
      @click="toggleInline"
    >
      {{ text }}
    </ButtonLink>

    <Transition :name="transitionName">
      <div
        v-if="isOpen"
        ref="dropdownSubListRef"
        :class="[
          {
            dropdownOverlay: isHoverDevice,
            [$style.inlineSubmenu]: !isHoverDevice,
          },
        ]"
        :style="submenuStyle"
      >
        <ul
          ref="dropdownListRef"
          :class="[
            $style.dropdownList,
            {
              dropdownContent: isHoverDevice,
            },
          ]"
        >
          <slot />
        </ul>
      </div>
    </Transition>
  </li>
</template>

<style module>
.inlineSubmenu {
  width: var(--width-height-100);
  padding-left: var(--space-8);
}

.dropdownList {
  @media (--tablet-up) {
    max-height: 90vh;
    overflow-x: auto;
  }
}
</style>
