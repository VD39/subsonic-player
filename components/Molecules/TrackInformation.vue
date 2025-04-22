<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import GenreList from '@/components/Atoms/GenreList.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';

defineProps<{
  track: Track;
}>();
</script>

<template>
  <div :class="['trackTable', $style.trackInformation]">
    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Title</div>

      <div class="trackCell">
        <p>{{ track.name }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Album</div>

      <div class="trackCell">
        <LinkOrText
          :is-link="!!track.albumId"
          :text="track.album"
          :to="`/album/${track.albumId}`"
        />
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Artists</div>

      <div class="trackCell">
        <ArtistsList
          v-if="track.artists.length"
          :artists="track.artists"
          :class="$style.list"
        />

        <p v-else ref="artistsElse">{{ DEFAULT_VALUE }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Track Number</div>

      <div class="trackCell">
        <p>{{ track.trackNumber }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Duration</div>

      <time class="trackCell">
        {{ track.duration }}
      </time>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Year</div>

      <div class="trackCell">
        <p>{{ track.year }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Disc number</div>

      <div class="trackCell">
        <p>{{ track.discNumber }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Genre</div>

      <div class="trackCell">
        <GenreList
          v-if="track.genres.length"
          :class="$style.list"
          :genres="track.genres"
        />

        <p v-else ref="genresElse">{{ DEFAULT_VALUE }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Play count</div>

      <div class="trackCell">
        <p>{{ track.information.playCount }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Size</div>

      <div class="trackCell">
        <p>{{ track.size }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Content type</div>

      <div class="trackCell">
        <p>
          {{ track.information.contentType }}
        </p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Suffix</div>

      <div class="trackCell">
        <p>
          {{ track.information.suffix }}
        </p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Bitrate</div>

      <div class="trackCell">
        <p>{{ track.information.bitRate }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Path</div>

      <div class="trackCell">
        <p>{{ track.information.path }}</p>
      </div>
    </div>
  </div>
</template>

<style module>
.trackInformation {
  a {
    color: var(--theme-color);
  }
}

.title {
  width: 25%;
}

.list {
  gap: 0;
}
</style>
