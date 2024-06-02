<script setup lang="ts">
const { getAlbums } = useAlbum();

const [newestAlbums, frequentAlbums, recentAlbums] = await Promise.all([
  getAlbums({
    type: 'newest',
    size: 10,
  }),
  getAlbums({
    type: 'frequent',
    size: 10,
  }),
  getAlbums({
    type: 'recent',
    size: 10,
  }),
]);
</script>

<template>
  <div>Hello Discover Page</div>
  <h1>newestAlbums</h1>

  <div v-if="newestAlbums?.length">
    <div v-for="item in newestAlbums" :key="item.name">
      <NuxtLink :to="`/album/${item.id}`">
        <pre>{{ item.name }}</pre>
      </NuxtLink>
    </div>
  </div>
  <h1>frequentAlbums</h1>

  <div v-if="frequentAlbums?.length">
    <div v-for="item in frequentAlbums" :key="item.name">
      <NuxtLink :to="`/album/${item.id}`">
        <pre>{{ item.name }}</pre>
      </NuxtLink>
    </div>
  </div>
  <h1>recentAlbums</h1>

  <div v-if="recentAlbums?.length">
    <div v-for="item in recentAlbums" :key="item.name">
      <NuxtLink :to="`/album/${item.id}`">
        <pre>{{ item.name }}</pre>
      </NuxtLink>
    </div>
  </div>
</template>
