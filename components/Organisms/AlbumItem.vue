<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ImageLink from '@/components/Organisms/ImageLink.vue';

const props = defineProps<{
  album: Album;
  hideArtist?: boolean;
}>();

const toLink = `/album/${props.album.id}`;
</script>

<template>
  <article>
    <ImageLink
      :to="toLink"
      :title="album.name"
      :image="album.image"
      class="mBS"
    />

    <p class="mBXS strong smallFont clamp2">
      <NuxtLink :to="toLink" class="link" :title="`Go to album ${album.name}`">
        {{ album.name }}
      </NuxtLink>
    </p>

    <ArtistsList
      v-if="!hideArtist && album.artists.length"
      :artists="album.artists"
      class="smallFont clamp2"
    />
  </article>
</template>
