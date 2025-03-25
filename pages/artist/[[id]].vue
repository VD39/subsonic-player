<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import GenreList from '@/components/Atoms/GenreList.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import TextClamp from '@/components/Atoms/TextClamp.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.artist],
});

const route = useRoute();
const { getArtist } = useArtist();
const { openModal } = useModal();

const { data: artistData, status } = useAsyncData(
  route.fullPath,
  async () => {
    const artist = await getArtist(route.params.id as string);

    return {
      artist,
    };
  },
  {
    default: () => ({
      artist: null,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

function openArtistBiographyModal() {
  openModal(MODAL_TYPE.readMoreModal, {
    text: artistData.value.artist!.biography,
    title: 'Artist biography',
  });
}

useHead({
  title: () =>
    [artistData.value.artist?.name, 'Artist'].filter(Boolean).join(' - '),
});
</script>

<template>
  <LoadingData :status="status">
    <div v-if="artistData.artist">
      <EntryHeader
        :images="[artistData.artist.image]"
        :title="artistData.artist.name"
      >
        <TextClamp
          v-if="artistData.artist.biography"
          :max-lines="2"
          :text="artistData.artist.biography"
          @more="openArtistBiographyModal"
        />

        <GenreList
          v-if="artistData.artist.genres.length"
          :genres="artistData.artist.genres"
        />

        <ul class="bulletList">
          <li>
            <span class="strong">{{ artistData.artist.totalAlbums }}</span>
            {{ artistData.artist.totalAlbums > 1 ? 'Albums' : 'Album' }}
          </li>
          <li>
            <span class="strong">{{ artistData.artist.totalTracks }}</span>
            {{ artistData.artist.totalTracks > 1 ? 'Tracks' : 'Track' }}
          </li>
        </ul>

        <div class="list">
          <FavouriteButton
            :id="artistData.artist.id"
            :favourite="artistData.artist.favourite"
            type="artist"
          />

          <ButtonLink
            is="a"
            v-if="artistData.artist.lastFmUrl"
            :href="artistData.artist.lastFmUrl"
            :icon="ICONS.lastFm"
            target="_blank"
            title="LastFm"
          />

          <ButtonLink
            is="a"
            v-if="artistData.artist.musicBrainzUrl"
            :href="artistData.artist.musicBrainzUrl"
            :icon="ICONS.musicBrainz"
            target="_blank"
            title="MusicBrainz"
          />
        </div>
      </EntryHeader>

      <h2>Albums</h2>

      <AlbumsList :albums="artistData.artist.albums" hide-artist />

      <template v-if="artistData.artist.similarArtist.length">
        <h2>Similar Artists</h2>

        <ArtistsList :artists="artistData.artist.similarArtist" />
      </template>
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.artist"
      message="No artist found."
    />
  </LoadingData>
</template>
