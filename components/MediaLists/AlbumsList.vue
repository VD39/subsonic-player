<script setup lang="ts">
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';
import MediaListWrapper from './MediaListWrapper.vue';
import AlbumItem from './AlbumItem.vue';

defineProps<{
  albums: Album[];
  rows?: string;
}>();
</script>

<template>
  <MediaListWrapper v-if="albums.length" :row="rows">
    <AlbumItem v-for="album in albums" :key="album.name" :album="album" />
  </MediaListWrapper>
  <NoMediaMessage v-else icon="PhVinylRecord" message="No albums found." />
</template>
