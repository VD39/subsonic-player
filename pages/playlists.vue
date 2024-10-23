<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import PlaylistsList from '@/components/Organisms/PlaylistsList.vue';

const {
  addPlaylistModal,
  deletePlaylist,
  getPlaylists,
  playlists,
  updatePlaylistModal,
} = usePlaylist();

onBeforeMount(async () => {
  if (!playlists.value.length) {
    await getPlaylists();
  }
});
</script>

<template>
  <LoadingData>
    <HeaderWithAction>
      <h1>Playlists</h1>

      <ButtonLink
        :icon-size="35"
        :icon="ICONS.add"
        title="Add playlist"
        @click="addPlaylistModal"
      >
        Add playlist
      </ButtonLink>
    </HeaderWithAction>

    <PlaylistsList
      :playlists="playlists"
      @delete-playlist="deletePlaylist"
      @edit-playlist="updatePlaylistModal"
    />
  </LoadingData>
</template>
