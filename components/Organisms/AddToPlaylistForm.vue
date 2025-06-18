<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InputField from '@/components/Atoms/InputField.vue';
import SubmitButton from '@/components/Molecules/SubmitButton.vue';

const props = defineProps<{
  loading: boolean;
  newlyCreatedPlaylistId: string;
  playlists: Playlist[];
}>();

const emit = defineEmits<{
  addToPlaylist: [
    value: {
      playlistId: string;
    },
  ];
  removeFromPlaylist: [
    value: {
      playlistId: string;
    },
  ];
  submit: [value: string | string[]];
}>();

const route = useRoute();

const selectedItems = ref(new Set<string>());

const formInputs = {
  name: {
    validationRules: {
      required: true,
    },
  },
};

const form = createForm(formInputs);

function addToRemoveFromPlaylist(playlistId: string) {
  if (playlistIdInSelectedItems(playlistId)) {
    removeFromSelectedPlaylist(playlistId);
  } else {
    addToSelectedPlaylist(playlistId);
  }
}

function addToSelectedPlaylist(playlistId: string) {
  emit('addToPlaylist', {
    playlistId,
  });

  selectedItems.value.add(playlistId);
}

function getButtonProps(playlistId: string) {
  const inSelected = playlistIdInSelectedItems(playlistId);

  return {
    icon: inSelected ? ICONS.remove : ICONS.add,
    text: inSelected ? 'Remove' : 'Add',
  };
}

function onFormSubmit() {
  validateInputs(form);

  if (!form.isValid.value) {
    return;
  }

  emit('submit', form.fields.name.value.value);

  form.fields.name.value.value = '';
}

function playlistIdInSelectedItems(playlistId: string) {
  return (
    playlistId === props.newlyCreatedPlaylistId ||
    selectedItems.value.has(playlistId)
  );
}

function removeFromSelectedPlaylist(playlistId: string) {
  emit('removeFromPlaylist', {
    playlistId,
  });

  selectedItems.value.delete(playlistId);
}

watch(
  [() => props.newlyCreatedPlaylistId, () => route.params],
  () => {
    if (props.newlyCreatedPlaylistId) {
      selectedItems.value.add(props.newlyCreatedPlaylistId);
    }

    const playlistId = route.params[ROUTE_PARAM_KEYS.playlist.id] as string;

    if (playlistId) {
      selectedItems.value.add(playlistId);
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div
    v-if="playlists.length"
    ref="playlistsWrapper"
    :class="['mBL', $style.playlists]"
  >
    <div class="trackTable">
      <div
        v-for="playlist in playlists"
        :key="playlist.id"
        class="trackRow trackBorder"
        data-test-id="playlist"
      >
        <div class="trackCell">
          <NuxtLink
            :aria-label="`Go to playlist ${playlist.name}`"
            :class="['mBS', $style.nuxtLink]"
            draggable="false"
            :to="{
              name: ROUTE_NAMES.playlist,
              params: {
                [ROUTE_PARAM_KEYS.playlist.id]: playlist.id,
              },
            }"
          >
            {{ playlist.name }}
          </NuxtLink>

          <div>
            <component :is="ICONS.playlist" />

            {{ playlist.trackCount }}
          </div>
        </div>

        <div class="trackCell trackOptions">
          <ButtonLink
            v-if="playlist.id !== RANDOM_PLAYLIST.id"
            :disabled="loading"
            :icon="getButtonProps(playlist.id).icon"
            :title="getButtonProps(playlist.id).text"
            @click="addToRemoveFromPlaylist(playlist.id)"
          >
            {{ getButtonProps(playlist.id).text }}
          </ButtonLink>
        </div>
      </div>
    </div>
  </div>

  <form ref="formWrapper" novalidate @submit.stop.prevent="onFormSubmit">
    <div class="spaceBetween">
      <InputField
        :id="form.fields.name.id"
        ref="playlistName"
        v-model="form.fields.name.value.value"
        class="formField"
        :error="form.fields.name.error.value"
        hideLabel
        :label="form.fields.name.label"
        placeholder="Add Playlist"
      />

      <SubmitButton :loading>Add</SubmitButton>
    </div>
  </form>
</template>

<style module>
.playlists {
  max-height: 60vh;
  overflow-x: auto;
}

.nuxtLink {
  display: inline-block;
}
</style>
