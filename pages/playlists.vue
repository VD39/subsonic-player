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

const {
  data: playlistsData,
  refresh,
  status,
} = useAsyncData(
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
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
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
      <RefreshButton :status="status" @refresh="refresh" />

      <ButtonLink
        icon-size="large"
        :icon="ICONS.add"
        title="Add playlist"
        @click="addPlaylistModal"
      >
        Add playlist
      </ButtonLink>
    </template>
  </HeaderWithAction>

  <LoadingData :status="status">
    <PlaylistsList
      :playlists="playlistsData.playlists"
      @delete-playlist="deletePlaylist"
      @edit-playlist="updatePlaylistModal"
    />
  </LoadingData>
</template>
