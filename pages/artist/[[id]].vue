<script setup lang="ts">
import EntryHeader from '@/components/Header/EntryHeader.vue';
import AlbumsList from '@/components/MediaLists/AlbumsList.vue';
import FavouriteButton from '@/components/Buttons/FavouriteButton.vue';
import IconButton from '@/components/Buttons/IconButton.vue';
import GenreList from '@/components/TrackDetails/GenreList.vue';

definePageMeta({
  middleware: ['artist'],
});

const route = useRoute();
const { openModal } = useModal();
const { artist, getArtist } = useArtist();

getArtist(route.params.id as string);

function openArtistBiographyModal(description: string) {
  openModal('artistBiographyModal', {
    description,
  });
}
</script>

<template>
  <div v-if="artist">
    <EntryHeader :images="[artist.image]" :title="artist.name">
      <TextClamp
        v-if="artist.biography"
        :max-lines="2"
        :text="artist.biography"
        @more="openArtistBiographyModal(artist.biography)"
      />

      <GenreList v-if="artist.genres.length" :genres="artist.genres" />

      <ul class="bulletList">
        <li>
          <span class="strong">{{ artist.totalAlbums }}</span>
          {{ artist.totalAlbums > 1 ? 'Albums' : 'Album' }}
        </li>
        <li>
          <span class="strong">{{ artist.totalTracks }}</span>
          {{ artist.totalTracks > 1 ? 'Tracks' : 'Track' }}
        </li>
      </ul>

      <ul class="list">
        <FavouriteButton
          :id="artist.id"
          type="album"
          :favourite="artist.favourite"
        />

        <IconButton
          is="a"
          v-if="artist.lastFmUrl"
          icon="PhLastfmLogo"
          title="LastFm"
          :href="artist.lastFmUrl"
          target="_blank"
        />

        <IconButton
          is="a"
          v-if="artist.musicBrainzUrl"
          icon="PhVinylRecord"
          title="MusicBrainz"
          :href="artist.musicBrainzUrl"
          target="_blank"
        />
      </ul>
    </EntryHeader>

    <div :class="$style.albums">
      <h2>Albums</h2>

      <AlbumsList :albums="artist.albums" />
    </div>
  </div>
</template>

<style module>
.figure {
  margin-bottom: var(--space-8);
}

.albums {
  position: relative;
}
</style>
