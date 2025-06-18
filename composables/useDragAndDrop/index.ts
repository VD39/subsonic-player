export function useDragAndDrop() {
  const route = useRoute();
  const { getAlbum } = useAlbum();
  const { addToPlaylist } = usePlaylist();
  const { getPodcast } = usePodcast();
  const { addTrackToQueue } = useAudioPlayer();

  const draggedElement = ref<HTMLElement | null>(null);
  const clonedElement = ref<HTMLElement | null>(null);
  const originalPosition = ref<DOMRect>({} as DOMRect);
  let animationFrameId: null | number = null;

  async function addTracks(
    tracksToAdd: MixedTrack[],
    target: HTMLElement | undefined,
    dropId: string,
  ) {
    for (const [index, track] of tracksToAdd.entries()) {
      target?.classList.add(DRAG_AND_DROP_CLASS_NAMES.droppedInZone);

      if (dropId === QUEUE_ID) {
        await addTrackToQueue(track);
        continue;
      }

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

  async function getTracksToAdd(media: DragAndDropMedia) {
    switch (media.type) {
      case MEDIA_TYPE.album: {
        const album = media as Album;

        if (album.tracks.length) {
          return album.tracks;
        }

        const selectedAlbum = await getAlbum(media.id);

        if (selectedAlbum) {
          return selectedAlbum.tracks;
        }

        return [];
      }
      case MEDIA_TYPE.playlist:
        return (media as Playlist).tracks;
      case MEDIA_TYPE.podcast: {
        const selectedPodcast = await getPodcast(media.id);

        if (selectedPodcast) {
          return selectedPodcast.episodes.downloaded;
        }

        return [];
      }
      case MEDIA_TYPE.podcastEpisode:
      case MEDIA_TYPE.track:
        return [media as MixedTrack];
      default:
        return [];
    }
  }

  function isValidMedia(media: DragAndDropMedia) {
    return media && 'type' in media;
  }

  function onDragEnd() {
    if (!clonedElement.value) {
      return;
    }

    // Cancel any pending animation frame
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    const { height, left, top, width } = originalPosition.value;

    // Animate back to original position
    Object.assign(clonedElement.value.style, {
      height: `${height}px`,
      transform: `translate(${left}px, ${top}px)`,
      transition: `transform ${TRANSFORM_SPEED}ms cubic-bezier(0.18, 0.89, 0.32, 1), width ${TRANSFORM_SPEED}ms ease, height ${TRANSFORM_SPEED}ms ease`,
      width: `${width}px`,
    });

    setTimeout(() => {
      clonedElement.value?.remove();
      if (draggedElement.value) {
        draggedElement.value.style.opacity = '1';
      }
      draggedElement.value = null;
      clonedElement.value = null;
    }, TRANSFORM_SPEED);

    document.removeEventListener('dragover', onDragOver);
    document.removeEventListener('dragenter', onDragEnter);
    document.removeEventListener('dragend', onDragEnd);
  }

  function onDragEnter(event: DragEvent) {
    event.preventDefault();

    const element = (event.target as HTMLElement)?.closest(
      `.${DRAG_AND_DROP_CLASS_NAMES.isDroppable}`,
    ) as HTMLElement;

    element?.classList.add(DRAG_AND_DROP_CLASS_NAMES.validDropZone);
    element?.addEventListener('dragleave', onDragLeave);
  }

  function onDragLeave(event: DragEvent) {
    event.preventDefault();

    const element = event.currentTarget as HTMLElement;
    const toElement = event.relatedTarget as HTMLElement;

    // If still inside the dropzone or its descendants, don't remove highlight
    if (toElement && element?.contains(toElement)) {
      return;
    }

    element?.classList.remove(DRAG_AND_DROP_CLASS_NAMES.validDropZone);
    element?.removeEventListener('dragleave', onDragLeave);
  }

  function onDragOver(event: DragEvent) {
    if (!clonedElement.value) {
      return;
    }

    event.preventDefault();

    // Use requestAnimationFrame for smoother animation
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
      // Calculate centred position
      const halfImageSize = IMAGE_HEIGHT_WIDTH / 2;
      const x = event.clientX - halfImageSize;
      const y = event.clientY - halfImageSize;

      clonedElement.value!.style.transform = `translate(${x}px, ${y}px)`;
      animationFrameId = null;
    });
  }

  function onDragStart(media: DragAndDropMedia, event: DragEvent) {
    if (!event.dataTransfer || !isValidMedia(media)) {
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

    document.addEventListener('dragover', onDragOver);
    document.addEventListener('dragenter', onDragEnter);
    document.addEventListener('dragend', onDragEnd);
  }
  async function onDrop(dropId: string, event: DragEvent) {
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

    const media: DragAndDropMedia = JSON.parse(mediaData);

    if (!isValidMedia(media)) {
      return;
    }

    const tracksToAdd = await getTracksToAdd(media);

    await addTracks(tracksToAdd, target, dropId);
  }

  return {
    onDragStart,
    onDrop,
  };
}
