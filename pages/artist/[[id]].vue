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
const { artist, getArtist } = useArtist();
const { openTrackInformationModal } = useDescription();

getArtist(route.params.id as string);

useHead({
  title: () => [artist.value?.name || '', 'Artist'].filter(Boolean).join(' - '),
});
</script>

<template>
  <LoadingData>
    <div v-if="artist">
      <EntryHeader :images="[artist.image]" :title="artist.name">
        <TextClamp
          v-if="artist.biography"
          :max-lines="2"
          :text="artist.biography"
          @more="openTrackInformationModal(artist)"
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
            type="artist"
            :favourite="artist.favourite"
          />

          <ButtonLink
            is="a"
            v-if="artist.lastFmUrl"
            :icon="ICONS.lastFm"
            title="LastFm"
            :href="artist.lastFmUrl"
            target="_blank"
          />

          <ButtonLink
            is="a"
            v-if="artist.musicBrainzUrl"
            :icon="ICONS.musicBrainz"
            title="MusicBrainz"
            :href="artist.musicBrainzUrl"
            target="_blank"
          />
        </ul>
      </EntryHeader>

      <h2>Albums</h2>

      <AlbumsList :albums="artist.albums" hide-artist />
    </div>

    <NoMediaMessage
      v-else
      :icon="IMAGE_DEFAULT_BY_TYPE.artist"
      message="No artist found."
    />
  </LoadingData>
</template>
