<script setup lang="ts">
const showStart = ref(false);
const showEnd = ref(false);

const containerRef = ref<HTMLElement | null>(null);

function onScroll() {
  if (!containerRef.value) {
    return;
  }

  const { offsetWidth, scrollLeft, scrollWidth } = containerRef.value;

  showStart.value = scrollLeft > 0;
  showEnd.value = Math.ceil(scrollLeft + offsetWidth) < scrollWidth;
}

function onResize() {
  onScroll();
}

onMounted(() => {
  onScroll();

  window.addEventListener('resize', debounce(onResize));
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div
    :class="[
      $style.overflowShadow,
      {
        [$style.start]: showStart,
        [$style.end]: showEnd,
      },
    ]"
  >
    <div ref="containerRef" :class="$style.content" @scroll="onScroll">
      <slot />
    </div>
  </div>
</template>

<style module>
.overflowShadow {
  position: relative;
  display: flex;
}

.end,
.start {
  &::after,
  &::before {
    position: absolute;
    inset: 0 auto;
    z-index: 1;
    display: block;
    width: 30px;
    content: '';
  }
}

.start {
  &::before {
    left: 0;
    background: linear-gradient(
      to left,
      transparent,
      var(--body-background-color) 90%
    );
  }
}

.end {
  &::after {
    right: 0;
    background: linear-gradient(
      to right,
      transparent,
      var(--body-background-color) 90%
    );
  }
}

.content {
  display: flex;
  flex: 1;
  overflow: auto;

  > * {
    white-space: nowrap;
  }
}
</style>
