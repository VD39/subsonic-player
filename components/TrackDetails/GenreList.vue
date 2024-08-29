<script setup lang="ts">
defineProps<{
  genres: Genre[];
}>();
</script>

<template>
  <ul class="commaList">
    <li
      v-for="genre in genres"
      :key="genre.name"
      data-test-id="genre-list-item"
    >
      <NuxtLink :to="`/genre/albums/${genre.name}`">
        {{ genre.name }}
      </NuxtLink>
    </li>
  </ul>
</template>
