<script setup lang="ts">
import DropdownDivider from '@/components/dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/player/controls/TrackPlayPause.vue';
import TrackPlayPauseDropdownItem from '@/components/player/controls/TrackPlayPauseDropdownItem.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';
import InteractionWrapper from '@/components/ui/InteractionWrapper.vue';
import LazyLoadContent from '@/components/ui/LazyLoadContent.vue';
import MarqueeScroll from '@/components/ui/MarqueeScroll.vue';

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

const { isCurrentTrack } = useQueue();

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
  <LazyLoadContent class="trackRow trackPlayPauseHover">
    <InteractionWrapper @click="onClick" @contextMenu="openDropdownMenu">
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
        <ButtonLink
          ref="addToQueueButton"
          :icon="ICONS.add"
          title="Add to queue"
          @click="$emit('addToQueue')"
        >
          Add to queue
        </ButtonLink>
      </div>

      <div class="trackCell trackOptions">
        <DropdownMenu ref="dropdownMenuRef">
          <TrackPlayPauseDropdownItem
            :trackId="track.id"
            :type="track.type"
            @playTrack="$emit('playTrack')"
          />
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
