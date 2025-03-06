<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';
import ImageLink from '@/components/Organisms/ImageLink.vue';

const props = defineProps<{
  album: Album;
  hideArtist?: boolean;
}>();

const { playTracks } = useAudioPlayer();
const { getAlbum } = useAlbum();

const loading = ref(false);

async function playAlbumTracks(albumId: string) {
  loading.value = true;

  const selectedAlbum = await getAlbum(albumId);

  if (selectedAlbum) {
    await playTracks(selectedAlbum.tracks);
  }

  loading.value = false;
}

const buttonProps = computed<ButtonProps>(() => ({
  icon: loading.value ? SpinningLoader : ICONS.play,
  text: `Play album ${props.album.name}`,
}));

const toLink = `/album/${props.album.id}`;
</script>

<template>
  <article>
    <div :class="$style.albumImageWrapper">
      <ImageLink
        :to="toLink"
        :title="`Go to album ${album.name}`"
        :image="album.image"
        class="mBS"
      />

      <ButtonLink
        :icon="buttonProps.icon"
        :class="['themeHoverButton', $style.buttonLink]"
        :title="buttonProps.text"
        @click="playAlbumTracks(album.id)"
      >
        {{ buttonProps.text }}
      </ButtonLink>
    </div>

    <p class="mBXS strong smallFont clamp2">
      <NuxtLink
        :to="toLink"
        class="link"
        :aria-label="`Go to album ${album.name}`"
      >
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

<style module>
.albumImageWrapper {
  position: relative;

  @media (hover: hover) {
    &:hover,
    &:focus {
      .buttonLink {
        --album-play-button-opacity: 1;
      }
    }
  }
}

.buttonLink {
  --album-play-button-opacity: 0;

  position: absolute;
  inset: auto var(--default-space) var(--default-space) auto;
  opacity: var(--album-play-button-opacity);
  transition: opacity var(--transition);
}
</style>
