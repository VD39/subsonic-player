export function sliceArrayBySizeAndOffset<T>(
  array: T[],
  size: number,
  offset: number,
) {
  // Calculate the end index based on size and offset
  const endIndex = offset + size;

  return array.slice(offset, endIndex);
}
