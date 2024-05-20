<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

const { modal, closeModal } = useModal();
</script>

<template>
  <Teleport to="#teleports">
    <transition name="modal-fade">
      <div
        v-if="modal.component"
        ref="modalContainer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        :class="[$style.modalContainer]"
        @click.self="closeModal"
      >
        <div
          ref="modalContent"
          :class="$style.modalContent"
          role="document"
          @click.stop
        >
          <div :class="$style.header">
            <h4 v-if="modal.title" ref="title" :class="$style.title">
              {{ modal.title }}
            </h4>

            <IconButton
              icon="PhX"
              title="Close modal"
              :icon-size="32"
              @click="closeModal"
            >
              Close modal
            </IconButton>
          </div>

          <div :class="$style.body">
            <component
              :is="modal.component"
              ref="component"
              v-bind="modal.attrs"
            />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style module>
.modalContainer {
  @mixin align-center;

  position: fixed;
  inset: 0;
  z-index: 3;
  justify-content: center;
  width: 100%;
  height: 100%;

  &::after {
    position: fixed;
    inset: 0;
    z-index: -1;
    content: '';
    background-color: var(--black-color);
    opacity: 0.85;
  }
}

.modalContent {
  position: relative;
  width: 80%;
  background-color: var(--modal-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-m);
  box-shadow: var(--box-shadow-medium);

  @media (--tablet-up) {
    max-width: 800px;
  }
}

.header {
  @mixin align-center;

  justify-content: space-between;
  padding: var(--space-16) var(--space-16) 0;
}

.title {
  margin-bottom: 0;
}

.body {
  padding: var(--space-16);
}

/* stylelint-disable selector-class-pattern */
:global {
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .modal-fade-enter,
  .modal-fade-leave-to {
    opacity: 0;
  }
}
/* stylelint-enable selector-class-pattern */
</style>
