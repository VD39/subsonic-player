<script setup lang="ts">
import MediaListWrapper from '@/components/Atoms/MediaListWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import ArtistItem from '@/components/Organisms/ArtistItem.vue';

defineProps<{
  artists: Artist[] | SimilarArtist[];
}>();
</script>

<template>
  <MediaListWrapper v-if="artists.length">
    <ArtistItem v-for="artist in artists" :key="artist.id" :artist />
  </MediaListWrapper>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.artist"
    message="No artists found."
  />
</template>
