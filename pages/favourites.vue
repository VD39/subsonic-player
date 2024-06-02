<script setup lang="ts">
const { favourites, getFavourites } = useFavourite();

getFavourites();
</script>

<template>
  <h1>Favourites</h1>

  <pre>{{ favourites }}</pre>
</template>
