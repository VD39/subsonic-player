<script setup lang="ts">
defineProps<{
  artists: BaseArtist[];
}>();
</script>

<template>
  <ul :class="[$style.meta, $style.list]">
    <li
      v-for="artist in artists"
      :key="artist.id"
      :class="$style.listItem"
      data-test-id="artist-list-item"
    >
      <NuxtLink :to="`/artist/${artist.id}`">
        {{ artist.name }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style module>
.list {
  @mixin align-center;
}

.listItem {
  &:not(:last-child)::after {
    content: ',\00a0';
  }

  &:nth-last-child(2)::after {
    content: '\00a0&\00a0';
  }
}
</style>
