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

if (!playlists.value.length) {
  getPlaylists();
}

useHead({
  title: 'Playlists',
});
</script>

<template>
  <HeaderWithAction>
    <h1>Playlists</h1>

    <div class="centerItems">
      <RefreshButton @refresh="getPlaylists" />

      <ButtonLink
        icon-size="large"
        :icon="ICONS.add"
        title="Add playlist"
        @click="addPlaylistModal"
      >
        Add playlist
      </ButtonLink>
    </div>
  </HeaderWithAction>

  <LoadingData>
    <PlaylistsList
      :playlists="playlists"
      @delete-playlist="deletePlaylist"
      @edit-playlist="updatePlaylistModal"
    />
  </LoadingData>
</template>
