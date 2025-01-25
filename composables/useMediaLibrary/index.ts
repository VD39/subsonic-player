export function useMediaLibrary() {
  const { fetchData, getDownloadUrl } = useAPI();
  const { addSuccessSnack } = useSnack();

  async function startScan() {
    const { data: startScanData } = await fetchData('/startScan');

    if (startScanData) {
      addSuccessSnack('Scan started.');
    }
  }

  async function downloadMedia(id: string) {
    const downloadURL = getDownloadUrl(id);
    window.location.assign(downloadURL);
  }

  /* istanbul ignore next -- @preserve */
  async function getBookmarks() {
    await fetchData('/getBookmarks');
  }

  /* istanbul ignore next -- @preserve */
  async function createBookmark() {
    await fetchData('/createBookmark', {
      method: 'POST',
    });
  }

  /* istanbul ignore next -- @preserve */
  async function deleteBookmark() {
    await fetchData('/deleteBookmark');
  }

  /* istanbul ignore next -- @preserve */
  async function getPlayQueue() {
    await fetchData('/getPlayQueue');
  }

  /* istanbul ignore next -- @preserve */
  async function savePlayQueue() {
    await fetchData('/savePlayQueue', {
      method: 'POST',
    });
  }

  return {
    createBookmark,
    deleteBookmark,
    downloadMedia,
    getBookmarks,
    getPlayQueue,
    savePlayQueue,
    startScan,
  };
}
