<script setup lang="ts">
import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import PlaylistsListItem from '@/components/Organisms/PlaylistsListItem.vue';

defineProps<{
  playlists: Playlist[];
}>();

defineEmits<{
  deletePlaylist: [trackId: string];
  editPlaylist: [playlist: Playlist];
}>();
</script>

<template>
  <GridWrapper v-if="playlists.length" desktop="2" mobile="1" tablet="2">
    <PlaylistsListItem
      v-for="playlist in playlists"
      :key="playlist.id"
      :playlist
      @deletePlaylist="$emit('deletePlaylist', playlist.id)"
      @editPlaylist="$emit('editPlaylist', playlist)"
    />
  </GridWrapper>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.playlist"
    message="No playlists found."
  />
</template>
