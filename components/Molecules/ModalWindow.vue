<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import HeaderWithAction from '@/components/Atoms/HeaderWithAction.vue';

const { closeModal, modal } = useModal();
</script>

<template>
  <Teleport to="#teleports">
    <transition name="fade">
      <div
        v-if="modal.component"
        ref="modalContainer"
        aria-labelledby="modal-title"
        aria-modal="true"
        class="fullscreen centerAll"
        role="dialog"
        @click.self="closeModal"
      >
        <div
          ref="modalContent"
          :class="$style.modalContent"
          role="document"
          @click.stop
        >
          <HeaderWithAction :class="$style.headerWithAction">
            <h3 v-if="modal.title" ref="title" :class="$style.title">
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
      </div>
    </transition>
  </Teleport>
</template>

<style module>
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
