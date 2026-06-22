<script setup lang="ts">
import ArtistLinks from '@/components/Atoms/ArtistLinks.vue';

defineProps<{
  item: SearchSuggestion;
}>();

defineEmits<{
  close: [];
}>();
</script>

<template>
  <NuxtLink
    class="centerItems searchItem"
    :to="item.route"
    @click="$emit('close')"
  >
    <span class="centerItems searchIcon">
      <component :is="item.icon" :size="ICON_SIZE.small" />
    </span>

    <span class="clamp searchName">{{ item.name }}</span>

    <ArtistLinks
      v-if="item.artists.length"
      :artists="item.artists"
      class="clamp smallFont searchArtistLinks"
    />
  </NuxtLink>
</template>
