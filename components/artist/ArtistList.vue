<script setup lang="ts">
import ArtistItem from '@/components/artist/ArtistItem.vue';
import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import GridWrapper from '@/components/ui/GridWrapper.vue';

defineProps<{
  artists: Artist[];
}>();

const { viewLayout } = useSettings();

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
