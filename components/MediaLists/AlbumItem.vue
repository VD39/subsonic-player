<script setup lang="ts">
import ArtistsList from '@/components/TrackDetails/ArtistsList.vue';
import ImageLink from '@/components/Image/ImageLink.vue';

const props = defineProps<{
  album: Album;
}>();

const toLink = `/album/${props.album.id}`;
</script>

<template>
  <article>
    <ImageLink :to="toLink" :title="album.name" :image="album.image" />

    <p class="clamp clamp2">
      <NuxtLink :to="toLink" :title="`Go to album ${album.name}`">
        {{ album.name }}
      </NuxtLink>
    </p>

    <ArtistsList
      v-if="album.artists.length"
      :artists="album.artists"
      class="clamp clamp2"
    />
  </article>
</template>
