<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
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

const albumProps = computed(() => ({
  title: `Go to album ${props.album.name}`,
  toLink: {
    name: ROUTE_NAMES.album,
    params: {
      [ROUTE_PARAM_KEYS.album.id]: props.album.id,
    },
  },
}));

const buttonProps = computed(() => ({
  icon: loading.value ? SpinningLoader : ICONS.play,
  text: `Play album ${props.album.name}`,
}));
</script>

<template>
  <article class="layoutItem">
    <div :class="$style.albumImageWrapper">
      <ImageLink
        class="layoutImage"
        :image="album.image"
        :title="albumProps.title"
        :to="albumProps.toLink"
      />

      <div :class="$style.actions">
        <FavouriteButton
          :id="album.id"
          :favourite="album.favourite"
          :type="album.type"
        />

        <ButtonLink
          ref="playAlbumButtonLink"
          class="themeHoverButton"
          :icon="buttonProps.icon"
          :title="buttonProps.text"
          @click="playAlbumTracks(album.id)"
        >
          {{ buttonProps.text }}
        </ButtonLink>
      </div>
    </div>

    <div class="layoutContent">
      <p class="mBXS strong smallFont clamp2">
        <NuxtLink
          :aria-label="albumProps.title"
          class="layoutLink"
          draggable="false"
          :to="albumProps.toLink"
        >
          {{ album.name }}
        </NuxtLink>
      </p>

      <ArtistsList
        v-if="!hideArtist && album.artists.length"
        :artists="album.artists"
        class="smallFont clamp2"
      />
    </div>
  </article>
</template>

<style module>
.albumImageWrapper {
  position: relative;

  @media (hover: hover) {
    &:hover,
    &:focus,
    &:focus-within {
      .actions {
        --album-actions-opacity: 1;
        --album-actions-z-index: 0;
      }
    }
  }
}

.actions {
  --album-actions-opacity: 0;
  --album-actions-z-index: -2;

  position: absolute;
  inset: auto var(--default-space) var(--default-space) auto;
  z-index: var(--album-actions-z-index);
  display: flex;
  gap: var(--default-space);
  opacity: var(--album-actions-opacity);
  transition: opacity var(--transition);

  :global(.listLayout) & {
    display: none;
  }
}
</style>
