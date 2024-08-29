<script setup lang="ts">
import ArtistsList from '@/components/TrackDetails/ArtistsList.vue';
import GenreList from '@/components/TrackDetails/GenreList.vue';

defineProps<{
  track: Track;
}>();

function setDefault(value: string | number = '-') {
  return value;
}
</script>

<template>
  <ul :class="$style.trackDetails">
    <li :class="$style.detail">
      <p :class="['strong', $style.title]">Title</p>
      <p ref="title" :class="$style.content">{{ setDefault(track.name) }}</p>
    </li>

    <li :class="$style.detail">
      <p :class="['strong', $style.title]">Album</p>

      <div :class="$style.content">
        <NuxtLink
          v-if="track.albumId && track.album"
          :to="`/album/${track.albumId}`"
          :class="$style.link"
        >
          {{ setDefault(track.album) }}
        </NuxtLink>
        <p v-else>-</p>
      </div>
    </li>

    <li :class="$style.detail">
      <p :class="['strong', $style.title]">Artists</p>

      <div :class="$style.content">
        <ArtistsList v-if="track.artists.length" :artists="track.artists" />
        <p v-else ref="artistsElse">-</p>
      </div>
    </li>

    <li :class="$style.detail">
      <p :class="['strong', $style.title]">Track</p>
      <p :class="$style.content">{{ setDefault(track.trackNumber) }}</p>
    </li>

    <li :class="$style.detail">
      <p :class="['strong', $style.title]">Duration</p>
      <time :class="$style.content">
        {{ setDefault(track.duration) }}
      </time>
    </li>

    <li :class="$style.detail">
      <p :class="['strong', $style.title]">Year</p>
      <p :class="$style.content">{{ setDefault(track.year) }}</p>
    </li>

    <li :class="$style.detail">
      <p :class="['strong', $style.title]">Disc number</p>
      <p :class="$style.content">{{ setDefault(track.discNumber) }}</p>
    </li>

    <li :class="$style.detail">
      <p :class="['strong', $style.title]">Genre</p>

      <div :class="$style.content">
        <GenreList v-if="track.genres.length" :genres="track.genres" />
        <p v-else ref="genresElse">-</p>
      </div>
    </li>

    <li :class="$style.detail">
      <p :class="['strong', $style.title]">Size</p>
      <p :class="$style.content">{{ setDefault(track.size) }}</p>
    </li>

    <ul
      v-if="track.information"
      ref="trackInformation"
      :class="$style.trackInformation"
    >
      <li :class="$style.detail">
        <p :class="['strong', $style.title]">Content type</p>
        <p :class="$style.content">
          {{ setDefault(track.information.contentType) }}
        </p>
      </li>

      <li :class="$style.detail">
        <p :class="['strong', $style.title]">Suffix</p>
        <p :class="$style.content">
          {{ setDefault(track.information.suffix) }}
        </p>
      </li>

      <li :class="$style.detail">
        <p :class="['strong', $style.title]">Bitrate</p>
        <p :class="$style.content">
          {{ setDefault(track.information.bitRate) }}
        </p>
      </li>

      <li :class="$style.detail">
        <p :class="['strong', $style.title]">Path</p>
        <p :class="$style.content">{{ setDefault(track.information.path) }}</p>
      </li>
    </ul>
  </ul>
</template>

<style module>
.trackDetails {
  display: table;
  width: 100%;
  border-collapse: collapse;
}

.detail {
  display: table-row;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }

  a {
    color: var(--theme-color);

    &:hover {
      text-decoration: underline;
    }
  }
}

.trackInformation {
  display: table-row-group;
}

.title,
.content {
  display: table-cell;
  padding: var(--space-8) var(--space-16) var(--space-8) 0;
}

.title {
  width: 20%;
}
</style>
