export function useDragAndDrop() {
  const route = useRoute();
  const { getMediaTracks } = useMediaTracks();
  const { addToPlaylist } = usePlaylist();
  const { addTracksToQueue } = useAudioPlayer();

  const draggedElement = ref<HTMLElement | null>(null);
  const clonedElement = ref<HTMLElement | null>(null);
  const originalPosition = ref<DOMRect>({} as DOMRect);
  const animationFrameId = ref<null | number>(null);

  async function addTracks(
    tracksToAdd: MixedTrack[],
    target: HTMLElement | undefined,
    dropId: string,
  ) {
    if (dropId === QUEUE_ID) {
      await addTracksToQueue(tracksToAdd);
      return;
    }

    for (const [index, track] of tracksToAdd.entries()) {
      target?.classList.add(DRAG_AND_DROP_CLASS_NAMES.droppedInZone);

      // Update playlist only if on the playlist page.
      const isMatchingPlaylist =
        route.params[ROUTE_PARAM_KEYS.playlist.id] === dropId;
      const isLast = index === tracksToAdd.length - 1;

      await addToPlaylist(
        {
          playlistId: dropId,
          songIdToAdd: track.id,
        },
        isMatchingPlaylist,
        isLast,
      );
    }

    // Remove only when all is complete.
    target?.classList.remove(DRAG_AND_DROP_CLASS_NAMES.droppedInZone);
  }

  function createElementClone(originalElement: HTMLElement) {
    const clonedEl = originalElement.cloneNode(true) as HTMLElement;
    originalPosition.value = originalElement.getBoundingClientRect();

    clonedEl.classList.add(DRAG_AND_DROP_CLASS_NAMES.clonedElement);

    const { left, top } = originalPosition.value;

    Object.assign(clonedEl.style, {
      height: `${IMAGE_HEIGHT_WIDTH}px`,
      transform: `translate(${left}px, ${top}px)`,
      transition: `transform ${TRANSFORM_SPEED}ms cubic-bezier(0.18, 0.89, 0.32, 1)`,
      width: `${IMAGE_HEIGHT_WIDTH}px`,
    });

    document.body.appendChild(clonedEl);
    return clonedEl;
  }

  function isValidMedia(media: MixedMediaAndTrack) {
    return media && 'type' in media;
  }

  async function dragEnd() {
    if (!clonedElement.value) {
      return;
    }

    // Cancel any pending animation frame.
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }

    const { height, left, top, width } = originalPosition.value;

    // Animate back to original position.
    Object.assign(clonedElement.value.style, {
      height: `${height}px`,
      transform: `translate(${left}px, ${top}px)`,
      transition: `transform ${TRANSFORM_SPEED}ms cubic-bezier(0.18, 0.89, 0.32, 1), width ${TRANSFORM_SPEED}ms ease, height ${TRANSFORM_SPEED}ms ease`,
      width: `${width}px`,
    });

    // Update to use a promise to make sure that element is removed from the DOM.
    await new Promise<void>((resolve) => {
      clonedElement.value?.remove();
      resolve();
    });

    if (draggedElement.value) {
      draggedElement.value.style.opacity = '1';
    }
    draggedElement.value = null;
    clonedElement.value = null;

    document.removeEventListener('dragover', dragOver);
    document.removeEventListener('dragenter', dragEnter);
    document.removeEventListener('dragend', dragEnd);
  }

  function dragEnter(event: DragEvent) {
    event.preventDefault();

    const element = (event.target as HTMLElement)?.closest(
      `.${DRAG_AND_DROP_CLASS_NAMES.isDroppable}`,
    ) as HTMLElement;

    element?.classList.add(DRAG_AND_DROP_CLASS_NAMES.validDropZone);
    element?.addEventListener('dragleave', dragLeave);
  }

  function dragLeave(event: DragEvent) {
    event.preventDefault();

    const element = event.currentTarget as HTMLElement;
    const toElement = event.relatedTarget as HTMLElement;

    // If still inside the dropzone or its descendants, don't remove highlight.
    if (toElement && element?.contains(toElement)) {
      return;
    }

    element?.classList.remove(DRAG_AND_DROP_CLASS_NAMES.validDropZone);
    element?.removeEventListener('dragleave', dragLeave);
  }

  function dragOver(event: DragEvent) {
    if (!clonedElement.value) {
      return;
    }

    event.preventDefault();

    // Use requestAnimationFrame for smoother animation.
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
    }

    animationFrameId.value = requestAnimationFrame(() => {
      // Calculate centred position.
      const halfImageSize = IMAGE_HEIGHT_WIDTH / 2;
      const x = event.clientX - halfImageSize;
      const y = event.clientY - halfImageSize;

      clonedElement.value!.style.transform = `translate(${x}px, ${y}px)`;
      animationFrameId.value = null;
    });
  }

  function dragStart(media: MixedMediaAndTrack, event: DragEvent) {
    if (!event.dataTransfer || draggedElement.value || !isValidMedia(media)) {
      return;
    }

    const targetElement = event.currentTarget as HTMLElement;
    const imgElement = targetElement?.querySelector('img');

    if (!imgElement) {
      return;
    }

    draggedElement.value = targetElement;
    draggedElement.value.style.opacity = '0.4';

    clonedElement.value = createElementClone(imgElement);

    const ghost = document.createElement('div');
    event.dataTransfer.setDragImage(ghost, 0, 0);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(DATA_TRANSFER_MEDIA_ID, JSON.stringify(media));

    document.addEventListener('dragover', dragOver);
    document.addEventListener('dragenter', dragEnter);
    document.addEventListener('dragend', dragEnd);
  }

  async function drop(dropId: string, event: DragEvent) {
    event.preventDefault();

    const target = event.currentTarget as HTMLElement;

    target?.classList.remove(DRAG_AND_DROP_CLASS_NAMES.validDropZone);

    if (!target?.classList.contains(DRAG_AND_DROP_CLASS_NAMES.isDroppable)) {
      return;
    }

    const mediaData = event.dataTransfer?.getData(DATA_TRANSFER_MEDIA_ID);

    if (!mediaData) {
      return;
    }

    const media: MixedMediaAndTrack = JSON.parse(mediaData);

    if (!isValidMedia(media)) {
      return;
    }

    const tracksToAdd = await getMediaTracks(media);

    if (!tracksToAdd?.length) {
      return;
    }

    await addTracks(tracksToAdd, target, dropId);
  }

  return {
    dragStart,
    drop,
  };
}
