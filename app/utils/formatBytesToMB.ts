export function formatBytesToMB(bytes = 0) {
  return (bytes / 1024 / 1024).toFixed(1);
}
