<script setup lang="ts">
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';

defineProps<{
  albums: Album[];
  hideArtist?: boolean;
}>();
</script>

<template>
  <MediaListWrapper v-if="albums.length">
    <AlbumItem
      v-for="album in albums"
      :key="album.name"
      :album="album"
      :hide-artist="hideArtist"
    />
  </MediaListWrapper>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.album"
    message="No albums found."
  />
</template>
