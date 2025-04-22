export function getIndex(array: MixedTrack[], id: string) {
  return array.findIndex(({ id: itemId }) => itemId === id);
}

export function shuffleArray(array: MixedTrack[], index = 0) {
  [array[0], array[index]] = [array[index], array[0]];

  const start = 1;

  for (let i = array.length - 1; i > start; i--) {
    const j = Math.floor(Math.random() * (i - start + 1) + start);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
