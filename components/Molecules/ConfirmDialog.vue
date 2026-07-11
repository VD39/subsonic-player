<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

withDefaults(
  defineProps<{
    confirmText?: string;
    message: string;
  }>(),
  {
    confirmText: 'Confirm',
  },
);

defineEmits<{
  cancel: [];
  confirm: [];
}>();
</script>

<template>
  <div :class="$style.content">
    <p>{{ message }}</p>

    <div class="centerItems" :class="$style.actions">
      <ButtonLink
        ref="cancelButtonLink"
        class="actionButton"
        showText
        @click="$emit('cancel')"
      >
        Cancel
      </ButtonLink>

      <ButtonLink
        ref="confirmButtonLink"
        class="actionButton"
        showText
        @click="$emit('confirm')"
      >
        {{ confirmText }}
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
  margin: var(--default-space) 0 0 auto;
}
</style>
