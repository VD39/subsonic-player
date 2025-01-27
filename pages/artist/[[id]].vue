<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import GenreList from '@/components/Atoms/GenreList.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import TextClamp from '@/components/Atoms/TextClamp.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.artist],
});

const route = useRoute();
const { getArtist } = useArtist();
const { openModal } = useModal();

const { data: artistData, status } = useAsyncData(
  `${ASYNC_DATA_NAMES.artist}-${route.params.id}`,
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
    [artistData.value.artist?.name || '', 'Artist'].filter(Boolean).join(' - '),
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
            type="artist"
            :favourite="artistData.artist.favourite"
          />

          <ButtonLink
            is="a"
            v-if="artistData.artist.lastFmUrl"
            :icon="ICONS.lastFm"
            title="LastFm"
            :href="artistData.artist.lastFmUrl"
            target="_blank"
          />

          <ButtonLink
            is="a"
            v-if="artistData.artist.musicBrainzUrl"
            :icon="ICONS.musicBrainz"
            title="MusicBrainz"
            :href="artistData.artist.musicBrainzUrl"
            target="_blank"
          />
        </div>
      </EntryHeader>

      <h2>Albums</h2>

      <AlbumsList :albums="artistData.artist.albums" hide-artist />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.artist"
      message="No artist found."
    />
  </LoadingData>
</template>
