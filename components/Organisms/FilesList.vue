<script setup lang="ts">
import LazyLoadContent from '@/components/Atoms/LazyLoadContent.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import PreloadImage from '@/components/Molecules/PreloadImage.vue';
import FileListItem from '@/components/Organisms/FileListItem.vue';

defineProps<{
  folders: MusicFolder[];
  tracks: Track[];
}>();

defineEmits<{
  addToPlaylist: [trackId: string];
  addToQueue: [track: Track];
  downloadMedia: [track: Track];
  mediaInformation: [track: Track];
  playTrack: [index: number];
}>();
</script>

<template>
  <div class="trackTable">
    <div
      v-if="$route.params[ROUTE_PARAM_KEYS.files.id]"
      ref="goBack"
      class="trackRow"
    >
      <div class="trackCell">
        <NuxtLink
          draggable="false"
          :to="$route.fullPath.split('/').slice(0, -1).join('/')"
        >
          <PreloadImage
            alt="Go back"
            :class="$style.trackImage"
            :image="IMAGE_DEFAULT_BY_TYPE.folderBack"
          />
          ...
          <p class="visuallyHidden">Go back</p>
        </NuxtLink>
      </div>
    </div>

    <template v-if="folders.length || tracks.length">
      <template v-if="folders.length">
        <LazyLoadContent
          v-for="folder in folders"
          :key="folder.id"
          class="trackRow"
          data-test-id="folder"
        >
          <div class="trackCell">
            <NuxtLink draggable="false" :to="`${$route.fullPath}/${folder.id}`">
              <PreloadImage
                :alt="folder.name"
                :class="$style.trackImage"
                :image="folder.image"
              />

              <MarqueeScroll class="mBXS" inert>
                {{ folder.name }}
              </MarqueeScroll>
            </NuxtLink>
          </div>
        </LazyLoadContent>
      </template>

      <template v-if="tracks.length">
        <FileListItem
          v-for="(track, index) in tracks"
          :key="track.id"
          :track
          @addToPlaylist="$emit('addToPlaylist', track.id)"
          @addToQueue="$emit('addToQueue', track)"
          @downloadMedia="$emit('downloadMedia', track)"
          @mediaInformation="$emit('mediaInformation', track)"
          @playTrack="$emit('playTrack', index)"
        />
      </template>
    </template>

    <div v-else class="trackRow">
      <div ref="noFoldersFiles" class="trackCell">
        <div>
          <PreloadImage
            alt="Go back"
            :class="$style.trackImage"
            :image="IMAGE_DEFAULT_BY_TYPE.noFolder"
          />

          <p>No folders/files found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.trackImage {
  width: var(--track-width-height-default);
  height: var(--track-width-height-default);
  overflow: hidden;
  border-radius: var(--border-radius-medium);
}
</style>
