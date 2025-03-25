<script setup lang="ts">
import ImageLink from '@/components/Organisms/ImageLink.vue';

const props = defineProps<{
  artist: Artist | SimilarArtist;
}>();

const toLink = `/artist/${props.artist.id}`;
</script>

<template>
  <article>
    <ImageLink
      class="mBS"
      :image="artist.image"
      :title="`Go to artist ${artist.name}`"
      :to="toLink"
    />

    <p class="mBXS strong smallFont clamp2">
      <NuxtLink
        :aria-label="`Go to artist ${artist.name}`"
        class="link"
        :to="toLink"
      >
        {{ artist.name }}
      </NuxtLink>
    </p>
  </article>
</template>
