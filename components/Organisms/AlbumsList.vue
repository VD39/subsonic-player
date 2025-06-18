<script setup lang="ts">
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';

defineProps<{
  albums: Album[];
  hideArtist?: boolean;
}>();

defineEmits<{
  dragStart: [album: Album, event: DragEvent];
}>();
</script>

<template>
  <MediaListWrapper v-if="albums.length">
    <AlbumItem
      v-for="album in albums"
      :key="album.name"
      :album
      draggable="true"
      :hideArtist
      @dragstart="$emit('dragStart', album, $event)"
    />
  </MediaListWrapper>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.album"
    message="No albums found."
  />
</template>
