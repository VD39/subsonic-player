<script setup lang="ts">
const cloneLength = ref(0);

const marqueeScrollRef = ref<HTMLElement | null>(null);
const marqueeContentRef = ref<HTMLElement | null>(null);

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
}

onMounted(() => {
  getCloneData();

  window.addEventListener('resize', getCloneData);
});

onUnmounted(() => {
  window.removeEventListener('resize', getCloneData);
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
  >
    <div :class="['bulletList', $style.inner]">
      <div ref="marqueeContentRef" :class="$style.content">
        <slot />
      </div>

      <div
        v-for="length in cloneLength"
        :key="length"
        :class="$style.content"
        aria-hidden="true"
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
    animation: marquee 20s linear infinite forwards;
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
