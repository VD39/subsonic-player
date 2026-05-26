<script setup lang="ts">
import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import PlaylistsListItem from '@/components/Organisms/PlaylistsListItem.vue';

defineProps<{
  playlists: Playlist[];
}>();

defineEmits<{
  deletePlaylist: [playlistId: string];
  editPlaylist: [playlist: Playlist];
}>();
</script>

<template>
  <GridWrapper
    v-if="playlists.length"
    desktopColumns="2"
    mobileColumns="1"
    tabletColumns="2"
  >
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
    :icon="FALLBACK_ICON_BY_TYPE.playlist"
    message="No playlists found."
  />
</template>
