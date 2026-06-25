<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InputField from '@/components/Atoms/InputField.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

import SearchSuggestions from './SearchSuggestions.vue';

const formInputs = {
  query: {
    validationRules: {
      required: true,
    },
  },
};

const { fetchSearchSuggestions } = useSearch();
const { addTrackToQueue, playTracks } = useAudioPlayer();
const { lockScroll, unlockScroll } = useScrollLock('searchSuggestions');

const form = createForm(formInputs);

const showSuggestions = ref(false);
const suggestions = ref<SuggestionGroup[]>([]);
const loading = ref(false);

const searchQuery = computed(() =>
  (form.fields.query.value.value as string).trim().toLowerCase(),
);

function addEscapeKeyListener() {
  document.addEventListener('keydown', onKeydown);
}

function clearQuery() {
  closeSuggestions();
  form.fields.query.value.value = '';
}

function closeSuggestions() {
  setShowSuggestions();
  (document.activeElement as HTMLElement)?.blur();
}

async function fetchSuggestions(query: string) {
  loading.value = true;

  const result = await fetchSearchSuggestions(query);

  if (query === searchQuery.value) {
    suggestions.value = result;
  }

  loading.value = false;
}

function onFocus() {
  if (searchQuery.value.length >= 2) {
    setShowSuggestions(true);
  }
}

async function onFormSubmit() {
  validateFormFields(form);

  if (!form.isValid.value) {
    return;
  }

  const query = replaceSpaceWithCharacter(searchQuery.value).toLowerCase();

  clearQuery();

  await navigateTo({
    name: ROUTE_NAMES.search,
    params: {
      [ROUTE_PARAM_KEYS.search.mediaType]: ROUTE_MEDIA_TYPE_PARAMS.Albums,
      [ROUTE_PARAM_KEYS.search.query]: query,
    },
  });
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeSuggestions();
  }
}

function onPlayTrack(track: PlayableTrack) {
  playTracks([track]);
}

function removeEscapeKeyListener() {
  document.removeEventListener('keydown', onKeydown);
}

function setShowSuggestions(value = false) {
  showSuggestions.value = value;

  if (value) {
    lockScroll();
    addEscapeKeyListener();
  } else {
    unlockScroll();
    removeEscapeKeyListener();
  }
}

const debouncedFetch = debounce(fetchSuggestions, 300);

watch(
  () => searchQuery.value,
  (query) => {
    if (query.length < 2) {
      debouncedFetch.cancel();
      suggestions.value = [];
      setShowSuggestions();
      loading.value = false;

      return;
    }

    loading.value = true;
    setShowSuggestions(true);
    debouncedFetch(query.toLowerCase());
  },
);

onUnmounted(() => {
  removeEscapeKeyListener();
  unlockScroll();
  debouncedFetch.cancel();
});
</script>

<template>
  <div :class="$style.searchForm">
    <form ref="searchForm" novalidate @submit.prevent="onFormSubmit">
      <div class="centerItems">
        <InputField
          :id="HOTKEY_ELEMENT_IDS.searchInput"
          v-model="form.fields.query.value.value"
          :class="$style.inputField"
          hideLabel
          :label="form.fields.query.label"
          placeholder="Enter query"
          :required="form.fields.query.required"
          @focus="onFocus"
        />

        <ButtonLink
          :class="$style.buttonLink"
          :icon="loading ? SpinningLoader : ICONS.search"
          type="submit"
        >
          {{ loading ? 'Searching...' : 'Search' }}
        </ButtonLink>
      </div>
    </form>

    <SearchSuggestions
      :class="$style.searchSuggestions"
      :loading
      :query="searchQuery"
      :showSuggestions
      :suggestions
      @addToQueue="addTrackToQueue"
      @close="clearQuery"
      @playTrack="onPlayTrack"
    />

    <div
      v-if="showSuggestions"
      ref="backdrop"
      class="backdrop"
      @click="clearQuery"
    />
  </div>
</template>

<style module>
.searchForm {
  position: relative;
  z-index: 2;

  @media (--mobile-only) {
    position: static;
  }
}

.inputField {
  input {
    padding-right: calc(var(--space-24) * 2);
  }
}

.buttonLink {
  margin-left: calc(var(--space-24) * -2);
}

.searchSuggestions {
  position: fixed;
  inset: var(--header-height) 0 0;
  z-index: 30;
  height: calc(100svh - var(--header-height) * 2);
  overflow-y: auto;
  background-color: var(--secondary-background-color);

  @media (--tablet-up) {
    position: absolute;
    inset: 100% 0 auto;
    height: auto;
    max-height: 75vh;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-small);
    box-shadow: var(--box-shadow-medium);
  }
}
</style>
