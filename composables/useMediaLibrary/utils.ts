export function downloadFileFromBlob(blob: Blob, track: DownloadTrack) {
  const url = globalThis.URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = replaceSpacesWithCharacter(track.name).substring(0, 50);
  document.body.appendChild(anchor);

  anchor.click();

  // Clean up from DOM.
  anchor.remove();
  globalThis.URL.revokeObjectURL(url);
}
