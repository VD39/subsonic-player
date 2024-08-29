<script setup lang="ts">
import PlaylistsList from '@/components/MediaLists/PlaylistsList.vue';

const { playlists, getPlaylists } = usePlaylist();

if (!playlists.value?.length) {
  getPlaylists();
}
</script>

<template>
  <h1>Playlists</h1>

  <PlaylistsList :playlists="playlists" rows="2" />
</template>
