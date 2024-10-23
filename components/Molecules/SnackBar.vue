<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import MessageBar from '@/components/Atoms/MessageBar.vue';

const { removeSnack, snacks } = useSnack();
</script>

<template>
  <Teleport to="#teleports">
    <transition name="slide-left-right">
      <div v-if="snacks.length" ref="snackbarWrapper" :class="$style.wrapper">
        <transition-group name="slide-left-right">
          <div
            v-for="snack in snacks"
            :key="snack.id"
            class="mBM"
            :class="$style.snackbar"
          >
            <MessageBar :type="snack.type">
              <p ref="content" class="sentenceCase">
                {{ snack.content }}
              </p>

              <ButtonLink :icon="ICONS.close" @click="removeSnack(snack.id)">
                Clear snack
              </ButtonLink>
            </MessageBar>
          </div>
        </transition-group>
      </div>
    </transition>
  </Teleport>
</template>

<style module>
.wrapper {
  position: fixed;
  inset: auto 0 0;
  z-index: 9;
  margin: var(--space-16) var(--space-16) 0;

  @media (--tablet-up) {
    left: auto;
  }
}

.snackbar {
  @media (--tablet-up) {
    width: min(50vw, 350px);
  }
}
</style>
