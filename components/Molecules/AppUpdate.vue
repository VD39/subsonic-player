<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import SpinningLoader from '@/components/Atoms/SpinningLoader.vue';

const emit = defineEmits<{
  dismiss: [];
  update: [];
}>();

const loading = ref(false);

const buttonProps = computed(() => ({
  icon: loading.value ? SpinningLoader : undefined,
  text: loading.value ? 'Reloading...' : 'Update',
}));

function dismiss() {
  emit('dismiss');
}

function update() {
  loading.value = true;
  emit('update');
}
</script>

<template>
  <div :class="$style.content">
    <p>A new version is available. Update now to get the latest features.</p>

    <p>
      <span class="strong">Note:</span>
      Updating the app will cause the current page to reload.
    </p>

    <div class="centerItems" :class="$style.actions">
      <ButtonLink
        ref="updateButtonLink"
        class="actionButton"
        :icon="buttonProps.icon"
        showText
        @click="update"
      >
        {{ buttonProps.text }}
      </ButtonLink>

      <ButtonLink
        ref="dismissButtonLink"
        class="actionButton"
        showText
        @click="dismiss"
      >
        Dismiss
      </ButtonLink>
    </div>
  </div>
</template>

<style module>
.content {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.actions {
  gap: var(--default-space);
  margin-top: var(--default-space);
}
</style>
