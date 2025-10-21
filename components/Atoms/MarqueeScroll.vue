<script setup lang="ts">
const MULTIPLICATION_TIME = 30;

const cloneLength = ref(0);
// Disable cloned content links so tabbing works as expected.
const disableClonedContent = ref(true);

const marqueeScrollRef = useTemplateRef('marqueeScrollRef');
const marqueeContentRef = useTemplateRef('marqueeContentRef');

const mutationObserver = ref<MutationObserver | null>(null);
const intersectionObserver = ref<IntersectionObserver | null>(null);

function getCloneData() {
  if (
    !marqueeContentRef.value ||
    !marqueeScrollRef.value ||
    !marqueeScrollRef.value.clientWidth
  ) {
    cloneLength.value = 0;
    return;
  }

  const isOverflowing =
    marqueeContentRef.value.clientWidth >= marqueeScrollRef.value.clientWidth;

  const clonedLength = Math.ceil(
    marqueeContentRef.value.clientWidth / marqueeScrollRef.value.clientWidth,
  );

  cloneLength.value = isOverflowing ? clonedLength : 0;

  setAnimationDuration(isOverflowing);
}

function onMouseOut() {
  disableClonedContent.value = true;
}

function onMouseOver() {
  // Enabled cloned content links so links can be clicked.
  disableClonedContent.value = false;
}

function setAnimationDuration(isOverflowing: boolean) {
  if (!marqueeContentRef.value || !marqueeScrollRef.value) {
    return;
  }

  const PROPERTY = '--animation-duration';

  if (!isOverflowing) {
    marqueeScrollRef.value.style.removeProperty(PROPERTY);
    return;
  }

  const distance =
    marqueeContentRef.value.offsetWidth + marqueeScrollRef.value.clientWidth;
  const duration = distance * MULTIPLICATION_TIME;

  marqueeScrollRef.value.style.setProperty(PROPERTY, `${duration}ms`);
}

const onResize = debounce(getCloneData, 1000);

onMounted(() => {
  if (!marqueeScrollRef.value || !marqueeContentRef.value) {
    return;
  }

  intersectionObserver.value = new IntersectionObserver(
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        getCloneData();
        globalThis.addEventListener('resize', onResize);
      } else {
        globalThis.removeEventListener('resize', onResize);
        cloneLength.value = 0;
      }
    },
    {
      threshold: 1,
    },
  );

  intersectionObserver.value.observe(marqueeScrollRef.value);

  // To watch slot data when it changes.
  mutationObserver.value = new MutationObserver(onResize);

  mutationObserver.value.observe(marqueeContentRef.value, {
    childList: true,
    subtree: true,
  });
});

onUnmounted(() => {
  globalThis.removeEventListener('resize', onResize);
  mutationObserver.value?.disconnect();
  intersectionObserver.value?.disconnect();
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
    @mouseout="onMouseOut"
    @mouseover="onMouseOver"
    @touchend.passive="onMouseOut"
    @touchstart.passive="onMouseOver"
  >
    <div :class="['bulletList', $style.inner]">
      <div ref="marqueeContentRef" :class="$style.content">
        <slot />
      </div>

      <div
        v-for="length in cloneLength"
        :key="length"
        aria-hidden="true"
        :class="[$style.content, $style.clonedContent]"
        data-test-id="cloned-item"
        :inert="disableClonedContent"
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
