<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    draggable?: boolean;
    is?: string;
  }>(),
  {
    draggable: true,
    is: 'div',
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
  contextMenu: [event: MouseEvent];
  dragStart: [event: DragEvent];
  longPress: [event: TouchEvent];
}>();

const instance = getCurrentInstance();

const { isAnyOpen } = useDropdownMenuState();

let longPressTimer: null | ReturnType<typeof setTimeout> = null;
let longPressTriggered = false;

function cancelLongPress() {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
}

// Only allow the event if the following is true.
function isInteractiveTarget(event: Event) {
  const target = event.target as HTMLElement;
  const element = target.closest('a, button');

  return !!element && !element.classList.contains(INTERACTION_LINK_CLASS);
}

function onClick(event: MouseEvent) {
  // If long press was just triggered, prevent click from propagating.
  if (longPressTriggered) {
    event.stopPropagation();
    event.preventDefault();

    // Reset flag after a short delay to allow future clicks.
    setTimeout(() => {
      longPressTriggered = false;
    }, 50);

    return;
  }

  if (isInteractiveTarget(event) || isAnyOpen.value) {
    return;
  }

  emit('click', event);
}

function onContextMenu(event: MouseEvent) {
  if (isInteractiveTarget(event)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  emit('contextMenu', event);
}

function onDragStart(event: DragEvent) {
  cancelLongPress();
  longPressTriggered = false;

  if (isInteractiveTarget(event)) {
    return;
  }

  emit('dragStart', event);
}

function startLongPress(event: TouchEvent) {
  if (isInteractiveTarget(event)) {
    return;
  }

  longPressTriggered = false;
  longPressTimer = setTimeout(() => {
    longPressTriggered = true;

    // Only emit longPress for touch events, otherwise onClick
    // will be called.
    emit('longPress', event);
  }, 500);
}

const isDraggable = computed(
  () =>
    !isAnyOpen.value && props.draggable && !!instance?.vnode.props?.onDragStart,
);

onBeforeUnmount(() => {
  cancelLongPress();
});
</script>

<template>
  <component
    :is
    :class="$style.interactionWrapper"
    :draggable="isDraggable"
    @click="onClick"
    @contextmenu="onContextMenu"
    @dragstart="onDragStart"
    @touchcancel="cancelLongPress"
    @touchend="cancelLongPress"
    @touchmove="cancelLongPress"
    @touchstart="startLongPress"
  >
    <slot />
  </component>
</template>

<style module>
.interactionWrapper {
  position: relative;
  display: inherit;
  align-content: flex-start;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style>
