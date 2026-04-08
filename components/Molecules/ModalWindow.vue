<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';

const { closeModal, modal } = useModal();
</script>

<template>
  <Teleport to="#teleports">
    <transition name="fade">
      <dialog
        v-if="modal.component"
        ref="modalContainer"
        aria-labelledby="modal-title"
        class="fullscreen centerAll"
        :class="$style.modalDialog"
        open
        @click.self="closeModal"
      >
        <div ref="modalContent" :class="$style.modalContent" @click.stop>
          <HeaderWithAction :class="$style.headerWithAction">
            <h3
              v-if="modal.title"
              id="modal-title"
              ref="title"
              :class="$style.title"
            >
              {{ modal.title }}
            </h3>

            <template #actions>
              <ButtonLink
                :icon="ICONS.close"
                iconSize="large"
                iconWeight="bold"
                title="Close modal"
                @click="closeModal"
              >
                Close modal
              </ButtonLink>
            </template>
          </HeaderWithAction>

          <div :class="['main', $style.body]">
            <component
              :is="modal.component"
              ref="component"
              v-bind="modal.attrs"
            />
          </div>
        </div>
      </dialog>
    </transition>
  </Teleport>
</template>

<style module>
.modalDialog {
  max-width: none;
  max-height: none;
  padding: 0;
  overflow: visible;
  color: inherit;
  background-color: transparent;
  border: none;
}

.modalContent {
  position: relative;
  width: 80%;
  background-color: var(--modal-background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--box-shadow-medium);

  @media (--tablet-up) {
    max-width: 800px;
  }
}

.headerWithAction {
  padding: var(--space-16) var(--space-16) 0;
}

.body {
  max-height: 80vh;
  padding: var(--space-16) var(--space-16) var(--space-24);
  overflow-y: auto;
}
</style>
