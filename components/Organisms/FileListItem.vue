<script setup lang="ts">
import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import LazyLoadContent from '@/components/Atoms/LazyLoadContent.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

const props = defineProps<{
  track: Track;
}>();

const emit = defineEmits<{
  addToPlaylist: [];
  addToQueue: [];
  downloadMedia: [];
  mediaInformation: [];
  playTrack: [];
}>();

const { isCurrentTrack } = useAudioPlayer();

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

function onClick() {
  if (isCurrentTrack(props.track.id)) {
    return;
  }

  emit('playTrack');
}

function openDropdownMenu(event: MouseEvent | TouchEvent) {
  dropdownMenuRef.value?.openDropdownMenu(event);
}
</script>

<template>
  <LazyLoadContent class="trackRow">
    <InteractionWrapper
      @click="onClick"
      @contextMenu="openDropdownMenu"
    >
      <div class="trackCell">
        <div>
          <TrackPlayPause
            :image="track.image"
            :trackId="track.id"
            :trackNumber="track.trackNumber"
            @playTrack="$emit('playTrack')"
          />

          <MarqueeScroll class="mBXS" inert>
            <h4>
              {{ track.name }}
            </h4>
          </MarqueeScroll>
        </div>
      </div>

      <div class="trackCell trackOptions">
        <DropdownMenu ref="dropdownMenuRef">
          <DropdownItem ref="playTrack" @click="$emit('playTrack')">
            Play Track
          </DropdownItem>
          <DropdownItem ref="addToQueue" @click="$emit('addToQueue')">
            Add to queue
          </DropdownItem>
          <DropdownItem ref="addToPlaylist" @click="$emit('addToPlaylist')">
            Add to playlist
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            ref="mediaInformation"
            @click="$emit('mediaInformation')"
          >
            Media information
          </DropdownItem>
          <DropdownItem ref="downloadMedia" @click="$emit('downloadMedia')">
            Download track
          </DropdownItem>
        </DropdownMenu>
      </div>
    </InteractionWrapper>
  </LazyLoadContent>
</template>
