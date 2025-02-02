<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import GenreList from '@/components/Atoms/GenreList.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import FavouriteButton from '@/components/Molecules/FavouriteButton.vue';
import LoadingData from '@/components/Molecules/LoadingData.vue';
import EntryHeader from '@/components/Organisms/EntryHeader.vue';
import TrackList from '@/components/Organisms/TrackList.vue';

definePageMeta({
  middleware: [MIDDLEWARE_NAMES.album],
});

const route = useRoute();
const { getAlbum } = useAlbum();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useMediaInformation();
const { addTracksToQueue, addTrackToQueue, playTracks, shuffleTracks } =
  useAudioPlayer();

const { data: albumData, status } = useAsyncData(
  route.fullPath,
  async () => {
    const album = await getAlbum(route.params.id as string);

    return {
      album,
    };
  },
  {
    default: () => ({
      album: null,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

function playTrack(index: number) {
  playTracks(albumData.value.album!.tracks, index - 1);
}

useHead({
  title: () =>
    [albumData.value.album?.name, 'Album'].filter(Boolean).join(' - '),
});
</script>

<template>
  <LoadingData :status="status">
    <div v-if="albumData.album">
      <EntryHeader
        :images="[albumData.album.image]"
        :title="albumData.album.name"
      >
        <ArtistsList
          v-if="albumData.album.artists.length"
          :artists="albumData.album.artists"
        />

        <GenreList
          v-if="albumData.album.genres.length"
          :genres="albumData.album.genres"
        />

        <ul class="bulletList">
          <li>
            <span class="visuallyHidden">Year: </span>
            {{ albumData.album.year }}
          </li>
          <li>
            <span class="strong">{{ albumData.album.trackCount }}</span>
            {{ albumData.album.trackCount > 1 ? ' Tracks' : ' Track' }}
          </li>
          <li>
            <span class="visuallyHidden">Duration: </span>
            <time>{{ albumData.album.duration }}</time>
          </li>
          <li>
            <span class="visuallyHidden">Size: </span>
            {{ albumData.album.size }}
          </li>
        </ul>

        <div class="list">
          <ButtonLink
            :icon="ICONS.play"
            title="Play tracks"
            class="largeThemeHoverButton"
            @click="playTracks(albumData.album.tracks)"
          >
            Play tracks
          </ButtonLink>

          <ButtonLink
            :icon="ICONS.shuffle"
            title="Shuffle tracks"
            @click="shuffleTracks(albumData.album.tracks)"
          >
            Shuffle tracks
          </ButtonLink>

          <FavouriteButton
            :id="albumData.album.id"
            type="album"
            :favourite="albumData.album.favourite"
          />

          <DropdownMenu>
            <DropdownItem @click="addTracksToQueue(albumData.album.tracks)">
              Add to queue
            </DropdownItem>
            <DropdownItem @click="playTracks(albumData.album.tracks)">
              Play Tracks
            </DropdownItem>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <TrackList
        :tracks="albumData.album.tracks"
        @play-track="playTrack"
        @add-to-queue="addTrackToQueue"
        @add-to-playlist="addToPlaylistModal"
        @media-information="openTrackInformationModal"
        @download-media="downloadMedia"
      />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.album"
      message="No album found."
    />
  </LoadingData>
</template>
