<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InputField from '@/components/Atoms/InputField.vue';
import SubmitButton from '@/components/Molecules/SubmitButton.vue';

const emit = defineEmits(['submit', 'addToPlaylist', 'removeFromPlaylist']);

const selectedItems = ref<string[]>([]);

defineProps<{
  loading: boolean;
  playlists: Playlist[];
  trackId: string;
}>();

const formInputs = {
  name: {
    validationRules: {
      required: true,
    },
  },
};

const form = createForm(formInputs);

function onFormSubmit() {
  validateInputs(form);

  if (!form.isValid.value) {
    return;
  }

  emit('submit', form.fields.name.value.value);
}

function playlistIdInSelectedItems(playlistId: string) {
  return selectedItems.value.includes(playlistId);
}

function addToSelectedPlaylist(playlistId: string) {
  emit('addToPlaylist', {
    playlistId,
  });

  selectedItems.value.push(playlistId);
}

function removeFromSelectedPlaylist(playlistId: string) {
  emit('removeFromPlaylist', {
    playlistId,
  });

  selectedItems.value = selectedItems.value.filter((id) => id !== playlistId);
}

function addToRemoveFromPlaylist(playlistId: string) {
  if (playlistIdInSelectedItems(playlistId)) {
    removeFromSelectedPlaylist(playlistId);
  } else {
    addToSelectedPlaylist(playlistId);
  }
}

function getButtonProps(playlistId: string) {
  const inSelected = playlistIdInSelectedItems(playlistId);

  return {
    icon: inSelected ? ICONS.remove : ICONS.add,
    text: inSelected ? 'Remove' : 'Add',
  };
}
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
            :to="`/playlist/${playlist.id}`"
            :class="['mBS', $style.nuxtLink]"
            :aria-label="`Go to playlist ${playlist.name}`"
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
        hide-label
        class="formField"
        :label="form.fields.name.label"
        placeholder="Add Playlist"
        :error="form.fields.name.error.value"
      />

      <SubmitButton :loading="loading">Add</SubmitButton>
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
