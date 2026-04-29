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

const itemIcon = computed(() => {
  if (isHoverDevice.value) {
    return ICONS.caretRight;
  }

  return isOpen.value ? ICONS.caretUp : ICONS.caretDown;
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
      :icon="itemIcon"
      iconPosition="right"
      showText
      @click="toggleInline"
    >
      {{ text }}
    </ButtonLink>

    <transition :name="transitionName">
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
    </transition>
  </li>
</template>

<style module>
.inlineSubmenu {
  width: 100%;
  padding-left: var(--space-8);
}

.dropdownList {
  @media (--tablet-up) {
    max-height: 90vh;
    overflow-x: auto;
  }
}
</style>
