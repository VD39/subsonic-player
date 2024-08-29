<script setup lang="ts">
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';
import MediaListWrapper from './MediaListWrapper.vue';
import ArtistItem from './ArtistItem.vue';

defineProps<{
  artists: Artist[];
  rows?: string;
}>();
</script>

<template>
  <MediaListWrapper v-if="artists.length" :row="rows">
    <ArtistItem v-for="artist in artists" :key="artist.id" :artist="artist" />
  </MediaListWrapper>
  <NoMediaMessage v-else icon="PhUsersThree" message="No artists found." />
</template>
