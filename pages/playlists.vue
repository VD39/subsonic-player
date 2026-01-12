<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import RefreshButton from '@/components/Molecules/RefreshButton.vue';
import PlaylistsList from '@/components/Organisms/PlaylistsList.vue';

const {
  addPlaylistModal,
  deletePlaylist,
  getPlaylists,
  playlists,
  updatePlaylistModal,
} = usePlaylist();

/* istanbul ignore next -- @preserve */
const { refresh, status } = useAsyncData(
  ASYNC_DATA_NAMES.playlists,
  async () => {
    await getPlaylists();

    return {
      playlists: playlists.value,
    };
  },
  {
    default: () => ({
      playlists: [],
    }),
    getCachedData: (key, nuxtApp, ctx) => {
      if (ctx.cause === 'refresh:manual') {
        return undefined;
      }

      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

useHead({
  title: 'Playlists',
});
</script>

<template>
  <HeaderWithAction>
    <h1>Playlists</h1>

    <template #actions>
      <RefreshButton :status @refresh="refresh" />

      <ButtonLink
        ref="addPlaylistButton"
        :icon="ICONS.add"
        iconSize="large"
        title="Add playlist"
        @click="addPlaylistModal"
      >
        Add playlist
      </ButtonLink>
    </template>
  </HeaderWithAction>

  <LoadingData :status>
    <PlaylistsList
      :playlists
      @deletePlaylist="deletePlaylist"
      @editPlaylist="updatePlaylistModal"
    />
  </LoadingData>
</template>
