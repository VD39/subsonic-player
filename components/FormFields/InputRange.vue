<script setup lang="ts">
const props = defineProps<{
  buffer?: number;
  delay?: boolean;
  hideThumb?: boolean;
  max: number;
  min: number;
  modelValue: number;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

const sliderRef = ref<HTMLElement | null>(null);
const thumbRef = ref<HTMLElement | null>(null);

const isSeeking = ref(false);
const isHovering = ref(false);
const hoverValue = ref(props.modelValue);
const pendingValue = ref(props.modelValue);

const progress = ref(getProgress(props.modelValue));
const bufferProgress = ref(getProgress(props.buffer));

const hoverProgress = computed(() => getProgress(hoverValue.value));

function getProgress(newValue = 0) {
  if (!sliderRef.value) {
    return 0;
  }

  return (newValue / props.max) * sliderRef.value.getBoundingClientRect().width;
}

function handleModifyProgress(event: MouseEvent) {
  if (!sliderRef.value) {
    return;
  }

  const { left, width } = sliderRef.value.getBoundingClientRect();

  const processedValue = ((event.pageX - left) / width) * props.max;
  const clippedValue = Math.min(Math.max(processedValue, props.min), props.max);

  hoverValue.value = clippedValue;

  if (isSeeking.value) {
    pendingValue.value = clippedValue;
    progress.value = getProgress(pendingValue.value);

    // don't update value when scrolling.
    if (!props.delay) {
      updateValue();
    }
  }
}

function updateValue() {
  value.value = pendingValue.value;
  emit('change', pendingValue.value);
}

function onMouseMove(event: MouseEvent) {
  isHovering.value = false;
  handleModifyProgress(event);
}

function onMouseUp() {
  updateValue();
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('mousemove', onMouseMove);
  isSeeking.value = false;
}

function onSliderMouseDown(event: MouseEvent) {
  isSeeking.value = true;
  handleModifyProgress(event);

  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mousemove', onMouseMove);
}

function onSliderMouseOver() {
  isHovering.value = true;
}

function onSliderMouseMove(event: MouseEvent) {
  if (isHovering.value) {
    handleModifyProgress(event);
  }
}

function updateProgress() {
  // Only update when user is not seeking.
  if (!isSeeking.value) {
    progress.value = getProgress(props.modelValue);
  }

  if (props.buffer) {
    bufferProgress.value = getProgress(props.buffer);
  }
}

watch(() => [props.buffer, props.modelValue], updateProgress, {
  immediate: true,
});

function onResize() {
  updateProgress();
}

onMounted(() => {
  updateProgress();

  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div
    :class="[
      $style.sliderWrapper,
      {
        [$style.seeking]: isSeeking,
      },
    ]"
    v-bind="$attrs"
  >
    <div
      ref="sliderRef"
      :class="$style.slider"
      @mousedown.stop.prevent="onSliderMouseDown"
      @mouseover="onSliderMouseOver"
      @mousemove="onSliderMouseMove"
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
        v-if="!hideThumb"
        ref="thumbRef"
        :class="$style.thumb"
        :style="{ left: `${progress - 6}px` }"
        @mousedown.stop.prevent="onSliderMouseDown"
      />

      <div
        v-if="$slots.default"
        ref="defaultSlot"
        :class="$style.tooltip"
        :style="{ left: `${hoverProgress}px` }"
      >
        <slot :pending-value="hoverValue" />
      </div>
    </div>
  </div>
</template>

<style module>
.tooltip {
  position: absolute;
  inset: auto auto var(--space-12) 50%;
  z-index: 9;
  padding: var(--space-4);
  margin-bottom: var(--space-8);
  font-size: var(--small-font-size);
  font-weight: 600;
  color: var(--black-color);
  white-space: nowrap;
  pointer-events: none;
  background-color: var(--white-color);
  box-shadow: var(--box-shadow-large);
  opacity: 0;
  transition:
    transform 0.2s ease 0.1s,
    opacity 0.2s ease 0.1s;
  transform: translate(-50%, 10px) scale(0.8);
  transform-origin: 50% 100%;

  &::before {
    position: absolute;
    inset: auto auto calc(var(--space-4) * -1) 50%;
    z-index: 9;
    width: 0;
    height: 0;
    content: '';
    border-top: 4px solid var(--white-color);
    border-right: 4px solid var(--black-color);
    border-left: 4px solid var(--black-color);
    transform: translateX(-50%);
  }
}

.sliderWrapper {
  padding: var(--space-8) 0;

  &.seeking,
  &:hover,
  &:focus {
    .tooltip {
      opacity: 1;
    }
  }
}

.slider {
  @mixin align-center;

  position: relative;
  width: 100%;
  height: 6px;
  cursor: pointer;
  background-color: var(--invert-color);
}

.progressWrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.buffer,
.process {
  position: absolute;
  inset: 0 auto auto 0;
  z-index: 1;
  height: 100%;
  background-color: var(--theme-color);
}

.buffer {
  z-index: 0;
  background-color: var(--theme-color);
  opacity: 0.5;
}

.thumb {
  position: absolute;
  z-index: 2;
  display: block;
  width: 12px;
  height: 12px;
  cursor: pointer;
  background-color: var(--theme-color);
  border-radius: 50%;
  box-shadow: var(--box-shadow-medium);
}
</style>
