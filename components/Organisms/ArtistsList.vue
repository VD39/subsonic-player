<script setup lang="ts">
import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import ArtistItem from '@/components/Organisms/ArtistItem.vue';

defineProps<{
  artists: Artist[];
}>();

const { viewLayout } = useViewLayout();

const layoutColumnOverride = computed(() =>
  viewLayout.value === 'gridLayout' ? undefined : '0',
);
</script>

<template>
  <GridWrapper
    v-if="artists.length"
    :desktopColumns="layoutColumnOverride"
    :mobileColumns="layoutColumnOverride"
    :spacing="layoutColumnOverride"
    :tabletColumns="layoutColumnOverride"
  >
    <ArtistItem v-for="artist in artists" :key="artist.id" :artist />
  </GridWrapper>

  <NoMediaMessage
    v-else
    :icon="FALLBACK_ICON_BY_TYPE.artist"
    message="No artists found."
  />
</template>
