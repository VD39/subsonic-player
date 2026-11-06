<script setup lang="ts">
import ArtistLinkList from '@/components/artist/ArtistLinkList.vue';

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

    <ArtistLinkList
      v-if="item.artists.length"
      :artists="item.artists"
      class="clamp smallFont searchArtistLinkList"
    />
  </NuxtLink>
</template>
