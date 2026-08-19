<script setup lang="ts">
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import PlaylistListItem from '@/components/playlist/PlaylistListItem.vue';
import GridWrapper from '@/components/ui/GridWrapper.vue';

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
    <PlaylistListItem
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
