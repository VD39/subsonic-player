<script setup lang="ts">
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import MixedTracksListItem from '@/components/Organisms/TrackLists/MixedTracksListItem.vue';

defineProps<{
  hideRemoveOption?: boolean;
  tracks: MixedTrack[];
}>();

const emit = defineEmits<{
  addToPlaylist: [trackId: string, index: number];
  addToQueue: [track: MixedTrack];
  downloadMedia: [track: MixedTrack];
  dragStart: [track: MixedTrack, event: DragEvent];
  mediaInformation: [track: MixedTrack];
  playTrack: [index: number];
  remove: [
    removeArgs: {
      id: string;
      index: number;
    },
  ];
  sortList: [fromIndex: number, toIndex: number];
}>();

const sortableListContainerRef = useTemplateRef('sortableListContainerRef');

const trackHeaderNames = TRACK_HEADER_NAMES.mix;

const hasAddToQueueEvent = computed(
  () => !!getCurrentInstance()?.vnode.props?.onAddToQueue,
);

const hasDragStartEvent = computed(
  () => !!getCurrentInstance()?.vnode.props?.onDragStart,
);

const hasSortListEvent = computed(
  () => !!getCurrentInstance()?.vnode.props?.onSortList,
);

useSortableList({
  listContainerRef: sortableListContainerRef,
  onReorder: (fromIndex: number, toIndex: number) => {
    if (!hasSortListEvent.value) {
      return;
    }

    emit('sortList', fromIndex, toIndex);
  },
});
</script>

<template>
  <div v-if="tracks.length" ref="tracksWrapper" class="trackTable withPreview">
    <div class="trackHeader">
      <div class="trackCell">{{ trackHeaderNames[0] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[1] }}</div>
      <div class="trackCell trackSecondary">{{ trackHeaderNames[2] }}</div>
      <div ref="trackTime" class="trackCell trackTime">
        {{ trackHeaderNames[3] }}
      </div>
      <div class="trackCell trackOptions" />
      <div
        v-if="hasAddToQueueEvent"
        ref="trackAddToQueueHeader"
        class="trackCell trackOptions"
      />
      <div
        v-if="!hideRemoveOption"
        ref="trackRemoveHeader"
        class="trackCell trackOptions"
      />
      <div
        v-if="hasSortListEvent"
        ref="trackSortListHeader"
        class="trackCell trackOptions"
      />
    </div>

    <div ref="sortableListContainerRef" class="sortableListContainer">
      <MixedTracksListItem
        v-for="(track, index) in tracks"
        :key="track.id"
        :class="[
          SORTABLE_LIST_CLASS_NAMES.item,
          SORTABLE_LIST_CLASS_NAMES.idle,
        ]"
        :hasAddToQueueEvent
        :hasDragStartEvent
        :hasSortListEvent
        :hideRemoveOption
        :index
        :track
        @addToPlaylist="$emit('addToPlaylist', track.id, index)"
        @addToQueue="$emit('addToQueue', track)"
        @downloadMedia="$emit('downloadMedia', track)"
        @dragStart="(event) => $emit('dragStart', track, event)"
        @mediaInformation="$emit('mediaInformation', track)"
        @playTrack="$emit('playTrack', index)"
        @remove="
          $emit('remove', {
            id: track.id,
            index,
          })
        "
      />
    </div>
  </div>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.track"
    message="No tracks found."
  />
</template>
