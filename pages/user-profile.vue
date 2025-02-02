<script setup lang="ts">
const user = useUser();
</script>

<template>
  <h1 v-if="user">Hello {{ user.username }}</h1>
</template>
