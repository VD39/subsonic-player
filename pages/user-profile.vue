<script setup lang="ts">
const user = useUser();

useHead({
  title: () =>
    [user.value?.username, 'User Profile'].filter(Boolean).join(' - '),
});
</script>

<template>
  <h1 v-if="user" ref="title">Hello {{ user.username }}</h1>
</template>
