<script setup lang="ts">
const MULTIPLICATION_TIME = 30;

const cloneLength = ref(0);
const disableClonedContent = ref(false);

const marqueeScrollRef = ref<HTMLElement | null>(null);
const marqueeContentRef = ref<HTMLElement | null>(null);
const mutationObserver = ref<MutationObserver | null>(null);

function setAnimationDuration() {
  if (!marqueeContentRef.value || !marqueeScrollRef.value) {
    return;
  }

  const distance =
    marqueeContentRef.value.offsetWidth + marqueeScrollRef.value.clientWidth;
  const duration = distance * MULTIPLICATION_TIME;

  marqueeScrollRef.value.style.setProperty(
    '--animation-duration',
    `${duration}ms`,
  );
}

function getCloneData() {
  if (!marqueeContentRef.value || !marqueeScrollRef.value) {
    return;
  }

  const isOverflowing =
    marqueeContentRef.value.clientWidth >= marqueeScrollRef.value.clientWidth;

  const clonedLength =
    Math.ceil(
      marqueeContentRef.value.clientWidth / marqueeScrollRef.value.clientWidth,
    ) || 0;

  cloneLength.value = isOverflowing ? clonedLength : 0;
  setAnimationDuration();
}

function onMouseOver() {
  disableClonedContent.value = true;
}

function onMouseOut() {
  disableClonedContent.value = false;
}

function onResize() {
  getCloneData();
}

onMounted(() => {
  if (!marqueeContentRef.value) {
    return;
  }

  getCloneData();

  window.addEventListener('resize', debounce(onResize, 1000));

  // To watch slot data when it changes.
  mutationObserver.value = new MutationObserver(onResize);

  mutationObserver.value.observe(marqueeContentRef.value, {
    childList: true,
    subtree: true,
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', getCloneData);
  mutationObserver.value?.disconnect();
});
</script>

<template>
  <div
    ref="marqueeScrollRef"
    :class="[
      $style.marqueeScroll,
      {
        [$style.animating]: cloneLength,
      },
    ]"
    @mousedown.prevent
    @mouseover="onMouseOver"
    @touchstart="onMouseOver"
    @mouseout="onMouseOut"
    @touchend="onMouseOut"
  >
    <div :class="['bulletList', $style.inner]">
      <div ref="marqueeContentRef" :class="$style.content">
        <slot />
      </div>

      <div
        v-for="length in cloneLength"
        :key="length"
        :class="[$style.content, $style.clonedContent]"
        aria-hidden="true"
        :inert="disableClonedContent"
        data-test-id="cloned-item"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style module>
.marqueeScroll {
  display: grid;
  width: var(--width-height-100);
  overflow: hidden;
}

.animating {
  --animation-play-state: running;

  mask: linear-gradient(
    90deg,
    transparent,
    var(--body-background-color) 10%,
    var(--body-background-color) 90%,
    transparent
  );

  @media (hover: hover) {
    &:hover {
      --animation-play-state: paused;
    }

    &:not(:focus):focus-within {
      mask: none;

      .content {
        animation: none;
      }
    }
  }
}

.inner {
  display: flex;
  flex-flow: row nowrap;
  width: max-content;
}

.content {
  flex: 0 0 auto;

  .animating & {
    animation: marquee var(--animation-duration) linear infinite forwards;
    animation-play-state: var(--animation-play-state);
  }
}

@keyframes marquee {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(-100%, 0);
  }
}
</style>
