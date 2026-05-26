<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    buffer?: number;
    commitOnRelease?: boolean;
    height?: number;
    hideThumb?: boolean;
    max: number;
    min: number;
  }>(),
  {
    buffer: undefined,
    height: 6,
  },
);

const emit = defineEmits<{
  change: [value: number];
}>();

const internalValue = defineModel<number>();

const sliderRef = useTemplateRef('sliderRef');

const isSeeking = ref(false);
const isHovering = ref(false);
const hoverValue = ref(internalValue.value);
const pendingValue = ref(internalValue.value);
const abortController = ref<AbortController | null>(null);

const progress = ref(getProgress(internalValue.value));
const bufferProgress = ref(getProgress(props.buffer));

const hoverProgress = computed(() => getProgress(hoverValue.value));
const isUnbounded = computed(() => !props.max);
const showThumb = computed(() => !props.hideThumb && !isUnbounded.value);

function getProgress(newValue = 0) {
  if (!sliderRef.value) {
    return 0;
  }

  const { width: sliderWidth } = sliderRef.value.getBoundingClientRect();

  // If max is not set, set progress to be width of the slider.
  if (isUnbounded.value) {
    return sliderWidth;
  }

  return (newValue / props.max) * sliderWidth;
}

function modifyProgress(event: MouseEvent | TouchEvent) {
  if (!sliderRef.value) {
    return;
  }

  const pointer = getPointerPosition(event);

  if (!pointer) {
    return;
  }

  const { left, width } = sliderRef.value.getBoundingClientRect();

  const processedValue = ((pointer.pageX - left) / width) * props.max;
  const clippedValue = Math.min(Math.max(processedValue, props.min), props.max);

  hoverValue.value = clippedValue;

  if (isSeeking.value) {
    pendingValue.value = clippedValue;
    progress.value = getProgress(pendingValue.value);

    // Don't update value when scrolling.
    if (!props.commitOnRelease) {
      updateValue();
    }
  }
}

function onDragMove(event: MouseEvent | TouchEvent) {
  isHovering.value = false;
  modifyProgress(event);
}

function onPointerUp() {
  updateValue();

  abortController.value?.abort();
  abortController.value = null;

  isSeeking.value = false;
}

function onSliderMouseMove(event: MouseEvent) {
  if (isHovering.value) {
    modifyProgress(event);
  }
}

function onSliderMouseOver() {
  isHovering.value = true;
}

function onSliderPointerDown(event: MouseEvent | TouchEvent) {
  isSeeking.value = true;
  modifyProgress(event);

  abortController.value = new AbortController();
  const { signal } = abortController.value;

  document.addEventListener('mouseup', onPointerUp, {
    signal,
  });
  document.addEventListener('mousemove', onDragMove, {
    signal,
  });
  document.addEventListener('touchend', onPointerUp, {
    passive: true,
    signal,
  });
  document.addEventListener('touchmove', onDragMove, {
    passive: true,
    signal,
  });
}

function updateProgress() {
  // Only update when user is not seeking.
  if (!isSeeking.value) {
    progress.value = getProgress(internalValue.value);
  }

  if (props.buffer) {
    bufferProgress.value = getProgress(props.buffer);
  }
}

function updateValue() {
  internalValue.value = pendingValue.value;
  emit('change', pendingValue.value!);
}

watch(() => [props.buffer, internalValue.value], updateProgress, {
  immediate: true,
});

const onResize = debounce(updateProgress);

onMounted(() => {
  updateProgress();

  globalThis.addEventListener('resize', onResize);
});

onUnmounted(() => {
  globalThis.removeEventListener('resize', onResize);
});
</script>

<template>
  <div
    :class="[
      $style.inputRange,
      {
        [$style.seeking]: isSeeking,
        [$style.standard]: isUnbounded,
      },
    ]"
    :style="{
      '--input-slider-height': `${height}px`,
    }"
  >
    <div
      ref="sliderRef"
      :class="['centerItems', $style.slider]"
      @mousedown.stop.prevent="onSliderPointerDown"
      @mousemove="onSliderMouseMove"
      @mouseover="onSliderMouseOver"
      @touchstart.stop.passive="onSliderPointerDown"
    >
      <div :class="$style.progressWrapper">
        <div
          ref="progressBar"
          :class="$style.process"
          :style="{ width: `${progress}px` }"
        />

        <div
          v-if="buffer"
          ref="bufferBar"
          :class="$style.buffer"
          :style="{ width: `${bufferProgress}px` }"
        />
      </div>

      <div
        v-if="showThumb"
        ref="thumb"
        :class="$style.thumb"
        :style="{ left: `${progress - 6}px` }"
        @mousedown.stop.prevent="onSliderPointerDown"
        @touchstart.stop.passive="onSliderPointerDown"
      />

      <div
        v-if="$slots.default && showThumb"
        ref="tooltip"
        :class="['mBS', 'strong', 'smallFont', $style.tooltip]"
        :style="{ left: `${hoverProgress}px` }"
      >
        <slot :pendingValue="hoverValue" />
      </div>
    </div>
  </div>
</template>

<style module>
.inputRange {
  position: relative;
  width: var(--width-height-100);
  padding: var(--default-space) 0;

  @media (hover: hover) {
    &.seeking,
    &:hover {
      .tooltip {
        --tooltip-opacity: 1;
      }
    }
  }
}

.slider {
  width: var(--width-height-100);
  height: var(--input-slider-height);
  cursor: pointer;
  background-color: var(--invert-color);

  .standard & {
    pointer-events: none;
    cursor: unset;
  }
}

.progressWrapper {
  --progress-wrapper-width-height: var(--width-height-100);

  position: relative;
  width: var(--progress-wrapper-width-height);
  height: var(--progress-wrapper-width-height);
  overflow: hidden;
}

.buffer,
.process {
  position: absolute;
  inset: 0 auto auto 0;
  z-index: 1;
  height: var(--width-height-100);
  background-color: var(--theme-color);

  .standard & {
    --process-background-color: color-mix(
      in oklab,
      var(--body-font-color) 25%,
      transparent
    );

    background-image: linear-gradient(
      -45deg,
      var(--process-background-color) 25%,
      transparent 25%,
      transparent 50%,
      var(--process-background-color) 50%,
      var(--process-background-color) 75%,
      transparent 75%,
      transparent
    );
    background-size: 50px 50px;
    animation: stripes-move 10s linear infinite;
  }
}

.buffer {
  z-index: 0;
  background-color: var(--theme-color);
  opacity: 0.5;
}

.thumb {
  --thumb-width-height: 12px;

  position: absolute;
  z-index: 2;
  display: block;
  width: var(--thumb-width-height);
  height: var(--thumb-width-height);
  cursor: pointer;
  background-color: var(--theme-color);
  border-radius: var(--border-radius-round);
  box-shadow: var(--box-shadow-medium);
}

.tooltip {
  --tooltip-opacity: 0;
  --tooltip-background-color: var(--body-background-color);

  position: absolute;
  inset: auto auto var(--space-32) 50%;
  z-index: 9;
  padding: var(--space-4);
  color: var(--body-font-color);
  white-space: nowrap;
  pointer-events: none;
  background-color: var(--tooltip-background-color);
  box-shadow: var(--box-shadow-large);
  opacity: var(--tooltip-opacity);
  transform: translate(-50%, 10px) scale(0.8);
  transform-origin: 50% 100%;
  transition:
    transform var(--transition),
    opacity var(--transition);

  &::before {
    position: absolute;
    inset: 100% auto auto 50%;
    margin-left: -5px;
    content: '';
    border-color: var(--tooltip-background-color) transparent transparent
      transparent;
    border-style: solid;
    border-width: 5px;
  }

  @media (--tablet-up) {
    bottom: var(--space-24);
  }
}

@keyframes stripes-move {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 50px 50px;
  }
}
</style>
