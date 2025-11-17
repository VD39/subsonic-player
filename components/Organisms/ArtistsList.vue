<script setup lang="ts">
import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import ArtistItem from '@/components/Organisms/ArtistItem.vue';

defineProps<{
  artists: (Artist | SimilarArtist)[];
}>();

const { viewLayout } = useViewLayout();

const gridWrapperProps = computed(() =>
  viewLayout.value === 'gridLayout' ? undefined : '0',
);
</script>

<template>
  <GridWrapper
    v-if="artists.length"
    :desktop="gridWrapperProps"
    :mobile="gridWrapperProps"
    :spacing="gridWrapperProps"
    :tablet="gridWrapperProps"
  >
    <ArtistItem v-for="artist in artists" :key="artist.id" :artist />
  </GridWrapper>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.artist"
    message="No artists found."
  />
</template>
