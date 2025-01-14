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
const { album, getAlbum } = useAlbum();
const { downloadMedia } = useMediaLibrary();
const { addToPlaylistModal } = usePlaylist();
const { openTrackInformationModal } = useDescription();
const { addTracksToQueue, addTrackToQueue, playTracks, shuffleTracks } =
  useAudioPlayer();

function playTrack(index: number) {
  playTracks(album.value!.tracks, index - 1);
}

getAlbum(route.params.id as string);

useHead({
  title: () => [album.value?.name || '', 'Album'].filter(Boolean).join(' - '),
});
</script>

<template>
  <LoadingData>
    <div v-if="album">
      <EntryHeader :images="[album.image]" :title="album.name">
        <ArtistsList v-if="album.artists.length" :artists="album.artists" />

        <GenreList v-if="album.genres.length" :genres="album.genres" />

        <ul class="bulletList">
          <li>
            <span class="visuallyHidden">Year: </span>
            {{ album.year }}
          </li>
          <li>
            <span class="strong">{{ album.trackCount }}</span>
            {{ album.trackCount > 1 ? ' Tracks' : ' Track' }}
          </li>
          <li>
            <span class="visuallyHidden">Duration: </span>
            <time>{{ album.duration }}</time>
          </li>
          <li>
            <span class="visuallyHidden">Size: </span>
            {{ album.size }}
          </li>
        </ul>

        <div class="list">
          <ButtonLink
            :icon="ICONS.play"
            title="Play tracks"
            class="largeThemeHoverButton"
            @click="playTracks(album.tracks)"
          >
            Play tracks
          </ButtonLink>

          <ButtonLink
            :icon="ICONS.shuffle"
            title="Shuffle tracks"
            @click="shuffleTracks(album.tracks)"
          >
            Shuffle tracks
          </ButtonLink>

          <FavouriteButton
            :id="album.id"
            type="album"
            :favourite="album.favourite"
          />

          <DropdownMenu>
            <DropdownItem @click="addTracksToQueue(album.tracks)">
              Add to queue
            </DropdownItem>
            <DropdownItem @click="playTracks(album.tracks)">
              Play Tracks
            </DropdownItem>
          </DropdownMenu>
        </div>
      </EntryHeader>

      <TrackList
        :tracks="album.tracks"
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
