<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { snacks, removeSnack } = useSnack();
</script>

<template>
  <Teleport to="#teleports">
    <transition name="slide-left-right">
      <div v-if="snacks.length" ref="snackbarWrapper" :class="$style.wrapper">
        <transition-group name="slide-left-right">
          <div v-for="snack in snacks" :key="snack.id">
            <div
              data-test-id="content-wrapper"
              :class="[$style[snack.type], $style.snackbar]"
            >
              <p data-test-id="content" :class="$style.content">
                {{ snack.content }}
              </p>

              <IconButton icon="PhX" @click="removeSnack(snack.id)">
                Clear snack
              </IconButton>
            </div>
          </div>
        </transition-group>
      </div>
    </transition>
  </Teleport>
</template>

<style module>
.wrapper {
  position: fixed;
  inset: auto 0 0 auto;
  z-index: 5;
  margin: var(--space-16) var(--space-16) 0;
}

.snackbar {
  @mixin align-center;

  gap: var(--space-8);
  justify-content: space-between;
  width: min(50vw, 350px);
  padding: var(--space-16);
  margin-bottom: var(--space-8);
  font-weight: 600;
  border-radius: var(--border-radius-medium);
}

.success {
  background-color: var(--success-color);
}

.error {
  background-color: var(--error-color);
}

.info {
  background-color: var(--info-color);
}

.content {
  font-size: var(--small-font-size);
  word-break: break-word;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
