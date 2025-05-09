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
import TracksList from '@/components/Organisms/TrackLists/TracksList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.artist],
});

const route = useRoute();
const { getArtist } = useArtist();
const { openModal } = useModal();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useMediaInformation();
const { addTrackToQueue, playTracks } = useAudioPlayer();

const { data: artistData, status } = getArtist(
  route.params[ROUTE_PARAM_KEYS.artist.id] as string,
);

function openArtistBiographyModal() {
  openModal(MODAL_TYPE.readMoreModal, {
    text: artistData.value!.biography,
    title: 'Artist biography',
  });
}

function playSimilarTracksTrack(index: number) {
  playTracks(artistData.value!.similarTracks, index - 1);
}

function playTopTracksTrack(index: number) {
  playTracks(artistData.value!.topTracks, index - 1);
}

useHead({
  title: () => [artistData.value?.name, 'Artist'].filter(Boolean).join(' - '),
});
</script>

<template>
  <LoadingData :status="status">
    <div v-if="artistData">
      <EntryHeader :images="[artistData.image]" :title="artistData.name">
        <TextClamp
          v-if="artistData.biography"
          :max-lines="2"
          :text="artistData.biography"
          @more="openArtistBiographyModal"
        />

        <GenreList
          v-if="artistData.genres.length"
          :genres="artistData.genres"
        />

        <ul class="bulletList">
          <li>
            <span class="strong">{{ artistData.totalAlbums }}</span>
            {{ artistData.totalAlbums > 1 ? 'Albums' : 'Album' }}
          </li>
          <li>
            <span class="strong">{{ artistData.totalTracks }}</span>
            {{ artistData.totalTracks > 1 ? 'Tracks' : 'Track' }}
          </li>
        </ul>

        <div class="list">
          <FavouriteButton
            :id="artistData.id"
            :favourite="artistData.favourite"
            type="artist"
          />

          <ButtonLink
            is="a"
            v-if="artistData.lastFmUrl"
            :href="artistData.lastFmUrl"
            :icon="ICONS.lastFm"
            target="_blank"
            title="LastFm"
          />

          <ButtonLink
            is="a"
            v-if="artistData.musicBrainzUrl"
            :href="artistData.musicBrainzUrl"
            :icon="ICONS.musicBrainz"
            target="_blank"
            title="MusicBrainz"
          />
        </div>
      </EntryHeader>

      <h2>Albums</h2>

      <AlbumsList :albums="artistData.albums" hide-artist />

      <template v-if="artistData.topTracks.length">
        <h2>Top Tracks</h2>

        <TracksList
          :tracks="artistData.topTracks"
          @add-to-playlist="addToPlaylistModal"
          @add-to-queue="addTrackToQueue"
          @download-media="downloadMedia"
          @media-information="openTrackInformationModal"
          @play-track="playTopTracksTrack"
        />
      </template>

      <template v-if="artistData.similarTracks.length">
        <h2>Similar Tracks</h2>

        <TracksList
          :tracks="artistData.similarTracks"
          @add-to-playlist="addToPlaylistModal"
          @add-to-queue="addTrackToQueue"
          @download-media="downloadMedia"
          @media-information="openTrackInformationModal"
          @play-track="playSimilarTracksTrack"
        />
      </template>

      <template v-if="artistData.similarArtist.length">
        <h2>Similar Artists</h2>

        <ArtistsList :artists="artistData.similarArtist" />
      </template>
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.artist"
      message="No artist found."
    />
  </LoadingData>
</template>
