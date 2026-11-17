<script setup lang="ts">
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import BaseIcon from '@/components/ui/BaseIcon.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';

defineProps<{
  activeSort: string;
  options: BaseSortOption[];
  sortDirection: SortDirection;
}>();

const emit = defineEmits<{
  selectSort: [key: string];
  toggleDirection: [];
}>();
</script>

<template>
  <div :class="['centerItems', 'mBL', $style.sortControls]">
    <DropdownMenu
      :class="$style.dropdownMenu"
      :icon="ICONS.sortMenu"
      isStatic
      title="Sort options"
    >
      <DropdownItem
        v-for="option in options"
        :key="option.key"
        :selected="activeSort === option.key"
        @click="emit('selectSort', option.key)"
      >
        {{ option.label }}
      </DropdownItem>
    </DropdownMenu>

    <ButtonLink
      ref="sortDirectionButtonLink"
      :class="$style.buttonLink"
      title="Toggle sort direction"
      @click="emit('toggleDirection')"
    >
      Toggle sort direction

      <template #icon>
        <span>
          <BaseIcon
            v-if="sortDirection === 'random'"
            aria-hidden="true"
            data-test-id="sort-icon-refresh"
            :icon="ICONS.refresh"
            :size="ICON_SIZE.small"
          />

          <template v-else>
            <BaseIcon
              v-for="option in SORT_BUTTONS"
              :key="option.key"
              aria-hidden="true"
              :class="[
                $style.sortIcon,
                {
                  [$style.sortActive]: sortDirection === option.key,
                },
              ]"
              :data-test-id="`sort-icon-${option.key}`"
              :icon="option.icon"
              :size="ICON_SIZE.small"
            />
          </template>
        </span>
      </template>
    </ButtonLink>
  </div>
</template>

<style module>
.sortControls {
  justify-content: flex-end;
}

.buttonLink {
  width: 50px;
}

.sortIcon {
  opacity: 0.5;
  transition: opacity var(--transition);

  &:nth-child(2) {
    margin-left: -5px;
  }
}

.sortActive {
  opacity: 1;
}
</style>
