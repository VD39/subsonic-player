<script setup lang="ts">
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import PreloadImage from '@/components/Molecules/PreloadImage.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

defineProps<{
  folders: MusicFolder[];
  tracks: Track[];
}>();

defineEmits<{
  addToPlaylist: [value: string];
  addToQueue: [value: Track];
  downloadMedia: [value: string];
  mediaInformation: [value: Track];
  playTrack: [value: number];
}>();
</script>

<template>
  <div class="trackTable">
    <div
      v-if="$route.params[ROUTE_PARAM_KEYS.files.id]"
      ref="goBack"
      class="trackRow"
    >
      <div :class="['trackCell', $style.trackCell]">
        <NuxtLink
          class="trackCell"
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
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="trackRow"
          data-test-id="folder"
        >
          <div :class="['trackCell', $style.trackCell]">
            <NuxtLink class="trackCell" :to="`${$route.fullPath}/${folder.id}`">
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
        </div>
      </template>

      <template v-if="tracks.length">
        <div
          v-for="(track, index) in tracks"
          :key="track.id"
          class="trackRow"
          data-test-id="track"
        >
          <div class="trackCell">
            <div>
              <TrackPlayPause
                :image="track.image"
                :track-id="track.id"
                :track-number="track.trackNumber"
                @play-track="$emit('playTrack', index)"
              />

              <MarqueeScroll class="mBXS" inert>
                <h4>
                  {{ track.name }}
                </h4>
              </MarqueeScroll>

              <DropdownMenu :class="$style.dropdownMenu">
                <DropdownItem
                  ref="addToPlaylist"
                  @click="$emit('addToPlaylist', track.id)"
                >
                  Add to playlist
                </DropdownItem>
                <DropdownItem
                  ref="mediaInformation"
                  @click="$emit('mediaInformation', track)"
                >
                  Media information
                </DropdownItem>
                <DropdownItem
                  ref="downloadMedia"
                  @click="$emit('downloadMedia', track.id)"
                >
                  Download track
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem
                  ref="addToQueue"
                  @click="$emit('addToQueue', track)"
                >
                  Add to queue
                </DropdownItem>
                <DropdownItem
                  ref="playTrack"
                  @click="$emit('playTrack', index)"
                >
                  Play Track
                </DropdownItem>
              </DropdownMenu>
            </div>
          </div>
        </div>
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
.trackCell {
  --track-cell-padding: 0;

  @media (--tablet-up) {
    --track-cell-padding: 0;
  }
}

.trackImage {
  width: var(--track-width-height-default);
  height: var(--track-width-height-default);
  overflow: hidden;
  border-radius: var(--border-radius-medium);
}

.dropdownMenu {
  margin-right: calc(var(--default-space) * -1.5);
}
</style>
