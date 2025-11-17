<script setup lang="ts">
import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import AlbumItem from '@/components/Organisms/AlbumItem.vue';

defineProps<{
  albums: Album[];
  hideArtist?: boolean;
}>();

defineEmits<{
  dragStart: [album: Album, event: DragEvent];
}>();

const { viewLayout } = useViewLayout();

const gridWrapperProps = computed(() =>
  viewLayout.value === 'gridLayout' ? undefined : '0',
);
</script>

<template>
  <GridWrapper
    v-if="albums.length"
    :desktop="gridWrapperProps"
    :mobile="gridWrapperProps"
    :spacing="gridWrapperProps"
    :tablet="gridWrapperProps"
  >
    <AlbumItem
      v-for="album in albums"
      :key="album.name"
      :album
      draggable="true"
      :hideArtist
      @dragstart="$emit('dragStart', album, $event)"
    />
  </GridWrapper>

  <NoMediaMessage
    v-else
    :icon="IMAGE_DEFAULT_BY_TYPE.album"
    message="No albums found."
  />
</template>
