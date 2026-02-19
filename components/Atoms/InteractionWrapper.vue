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
}>();

const instance = getCurrentInstance();

const { isAnyOpen } = useDropdownMenuState();

const isTouching = ref(false);

function cancelTouch() {
  isTouching.value = false;
}

// Only allow the event if the following is true.
function isInteractiveTarget(event: Event) {
  const target = event.target as HTMLElement;
  const element = target.closest('a, button');

  return !!element && !element.classList.contains(INTERACTION_LINK_CLASS);
}

function onClick(event: MouseEvent) {
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
  if (isInteractiveTarget(event)) {
    return;
  }

  emit('dragStart', event);
}

function onTouchStart() {
  isTouching.value = true;
}

const isDraggable = computed(
  () =>
    !isTouching.value &&
    !isAnyOpen.value &&
    props.draggable &&
    !!instance?.vnode.props?.onDragStart,
);
</script>

<template>
  <component
    :is
    :class="$style.interactionWrapper"
    :draggable="isDraggable"
    @click="onClick"
    @contextmenu="onContextMenu"
    @dragstart="onDragStart"
    @touchcancel="cancelTouch"
    @touchend="cancelTouch"
    @touchstart="onTouchStart"
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
  user-select: none;
}
</style>
