<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';

defineProps<{
  activeSort: string;
  options: BaseSortOption[];
  sortDirection: SortDirection;
}>();

const emit = defineEmits<{
  toggleSort: [key: string];
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
        @click="emit('toggleSort', option.key)"
      >
        {{ option.label }}
      </DropdownItem>
    </DropdownMenu>

    <ButtonLink
      ref="sortDirectionButtonLink"
      :class="$style.buttonLink"
      title="Toggle sort direction"
      @click="emit('toggleSort', activeSort)"
    >
      Toggle sort direction

      <template #icon>
        <span>
          <component
            :is="ICONS.refresh"
            v-if="sortDirection === 'random'"
            aria-hidden="true"
            :data-test-id="'sort-icon-refresh'"
            :size="ICON_SIZE.small"
            weight="bold"
          />

          <template v-else>
            <component
              :is="option.icon"
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
              :size="ICON_SIZE.small"
              weight="bold"
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
  opacity: 0.3;
  transition: opacity var(--transition);

  &:nth-child(2) {
    margin-left: -5px;
  }
}

.sortActive {
  opacity: 1;
}
</style>
