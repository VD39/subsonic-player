<script setup lang="ts">
import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import GenreList from '@/components/Atoms/GenreList.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';

defineProps<{
  album: Album;
}>();
</script>

<template>
  <div :class="['trackTable', $style.albumInformation]">
    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Title</div>

      <div class="trackCell">
        <LinkOrText
          :isLink="!!album.id"
          :text="album.name"
          :to="{
            name: ROUTE_NAMES.album,
            params: {
              [ROUTE_PARAM_KEYS.album.id]: album.id,
            },
          }"
        />
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Artists</div>

      <div class="trackCell">
        <ArtistsList
          v-if="album.artists.length"
          :artists="album.artists"
          :class="$style.list"
        />

        <p v-else ref="artistsElse">{{ DEFAULT_VALUE }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Year</div>

      <div class="trackCell">
        <p>{{ album.year }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Genre</div>

      <div class="trackCell">
        <GenreList
          v-if="album.genres.length"
          :class="$style.list"
          :genres="album.genres"
        />

        <p v-else ref="genresElse">{{ DEFAULT_VALUE }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">
        Total disc numbers
      </div>

      <div class="trackCell">
        <p>{{ album.totalDiscNumber }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Track count</div>

      <div class="trackCell">
        <p>{{ album.trackCount }}</p>
      </div>
    </div>

    <div class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Duration</div>

      <time class="trackCell">
        {{ album.formattedDuration }}
      </time>
    </div>

    <div ref="sizeRow" class="trackRow trackBorder">
      <div :class="['trackCell', 'trackMeta', $style.title]">Size</div>

      <div class="trackCell">
        <p>{{ album.size }}</p>
      </div>
    </div>
  </div>
</template>

<style module>
.albumInformation {
  a {
    color: var(--theme-color);
  }
}

.title {
  min-width: 25%;
}

.list {
  gap: 0;
}
</style>
