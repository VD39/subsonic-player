<script setup lang="ts">
const { playlists, getPlaylists } = usePlaylist();

if (!playlists.value?.length) {
  getPlaylists();
}
</script>

<template>
  <h1>Playlists</h1>

  <pre>{{ playlists }}</pre>
</template>
