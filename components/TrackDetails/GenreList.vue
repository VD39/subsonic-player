<script setup lang="ts">
defineProps<{
  genres: Genre[];
}>();
</script>

<template>
  <ul :class="[$style.meta, $style.list]">
    <li
      v-for="genre in genres"
      :key="genre.name"
      :class="$style.listItem"
      data-test-id="genre-list-item"
    >
      <NuxtLink :to="`/genre/albums/${genre.name}`">
        {{ genre.name }}
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
}
</style>
