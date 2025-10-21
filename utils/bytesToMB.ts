export function bytesToMB(bytes: number | string = '') {
  const sizeInBytes = Number(bytes);

  if (!bytes || Number.isNaN(sizeInBytes)) {
    return DEFAULT_VALUE;
  }

  const KB = sizeInBytes / 1024;
  const MB = KB / 1024;
  const GB = MB / 1024;

  if (GB >= 1) {
    return `${GB.toFixed(2)} GB`;
  }

  if (MB >= 1) {
    return `${MB.toFixed(2)} MB`;
  }

  return `${KB.toFixed(2)} KB`;
}
