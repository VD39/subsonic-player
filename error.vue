<script setup lang="ts">
interface Props {
  error?: {
    message?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  error: undefined,
});

// On WebOS, if we get a "Page not found" error with a file system path,
// redirect to the index page
onMounted(() => {
  const isWebOS = window?.location?.protocol === 'file:';
  const errorMessage = props.error?.message || '';

  if (isWebOS && errorMessage.includes('/media/')) {
    navigateTo({
      name: ROUTE_NAMES.index,
      replace: true,
    });
  }
});
</script>

<template>
  <NuxtLayout>
    <div class="inner centerAll fullscreen">
      <p>{{ error?.message || 'An error occurred' }}</p>
    </div>
  </NuxtLayout>
</template>
