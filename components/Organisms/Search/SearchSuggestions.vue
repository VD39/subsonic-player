<script setup lang="ts">
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

import SearchSuggestionItem from './SearchSuggestionItem.vue';
import SearchSuggestionTrackItem from './SearchSuggestionTrackItem.vue';

defineProps<{
  loading: boolean;
  query: string;
  showSuggestions: boolean;
  suggestions: SuggestionGroup[];
}>();

defineEmits<{
  addToQueue: [track: Track];
  close: [];
  playTrack: [track: Track];
}>();
</script>

<template>
  <Transition name="slide-down">
    <div v-if="showSuggestions" ref="suggestionsWrapper" @mousedown.prevent>
      <SpinningLoader v-if="loading" :class="['centerAll', $style.loader]" />

      <template v-else>
        <div
          v-if="!suggestions.length"
          ref="noResultsFound"
          :class="['centerAll', $style.noResultsFound]"
        >
          No results found
        </div>

        <template v-else>
          <div
            v-for="group in suggestions"
            :key="group.searchType"
            :class="$style.section"
            data-test-id="search-suggestion-group"
          >
            <div :class="['centerItems', 'spaceBetween', $style.titleWrapper]">
              <div :class="['smallFont', $style.title]">{{ group.title }}</div>

              <NuxtLink
                class="smallFont link"
                data-test-id="viewAllLink"
                :to="{
                  name: ROUTE_NAMES.search,
                  params: {
                    [ROUTE_PARAM_KEYS.search.mediaType]: group.searchType,
                    [ROUTE_PARAM_KEYS.search.query]: query,
                  },
                }"
                @click="$emit('close')"
              >
                View all
              </NuxtLink>
            </div>

            <template v-for="item in group.items" :key="item.id">
              <SearchSuggestionItem
                v-if="!item.track"
                :item
                @close="$emit('close')"
              />

              <SearchSuggestionTrackItem
                v-else
                :track="item.track"
                @addToQueue="$emit('addToQueue', $event)"
                @close="$emit('close')"
                @playTrack="$emit('playTrack', $event)"
              />
            </template>
          </div>
        </template>
      </template>
    </div>
  </Transition>
</template>

<style module>
.loader,
.noResultsFound {
  padding: var(--space-16);
  color: var(--secondary-font-color);
}

.section {
  padding: var(--space-4) 0;

  & + & {
    border-top: 1px solid var(--border-color);
  }
}

.titleWrapper {
  padding: var(--space-4) var(--space-12);
}

.title {
  font-weight: 700;
  color: var(--secondary-font-color);
  text-transform: uppercase;
}
</style>
