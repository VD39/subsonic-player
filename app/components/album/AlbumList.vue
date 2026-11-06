<script setup lang="ts">
import AlbumItem from '@/components/album/AlbumItem.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import GridWrapper from '@/components/ui/GridWrapper.vue';

defineProps<{
  albums: Album[];
  hideArtist?: boolean;
}>();

const emit = defineEmits<{
  addToQueue: [album: Album];
  dragStart: [album: Album, event: DragEvent];
  mediaInformation: [album: Album];
  playAlbum: [album: Album];
}>();

const { viewLayout } = useSettings();

function onDragStart(album: Album, event: DragEvent) {
  emit('dragStart', album, event);
}

const layoutColumnOverride = computed(() =>
  viewLayout.value === 'gridLayout' ? undefined : '0',
);
</script>

<template>
  <GridWrapper
    v-if="albums.length"
    :desktopColumns="layoutColumnOverride"
    :mobileColumns="layoutColumnOverride"
    :spacing="layoutColumnOverride"
    :tabletColumns="layoutColumnOverride"
  >
    <AlbumItem
      v-for="album in albums"
      :key="album.name"
      :album
      :hideArtist
      @addToQueue="$emit('addToQueue', $event)"
      @dragStart="onDragStart"
      @mediaInformation="$emit('mediaInformation', $event)"
      @playAlbum="$emit('playAlbum', $event)"
    />
  </GridWrapper>

  <NoMediaMessage
    v-else
    :icon="FALLBACK_ICON_BY_TYPE.album"
    message="No albums found."
  />
</template>
