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
    const { data: bookmarksData } = await fetchData('/getBookmarks');

    if (bookmarksData) {
      return bookmarksData;
    }
  }

  /* istanbul ignore next -- @preserve */
  async function createBookmark(id: string, position: string) {
    await fetchData('/createBookmark', {
      method: 'POST',
      params: {
        id,
        position,
      },
    });
  }

  /* istanbul ignore next -- @preserve */
  async function deleteBookmark(id: string) {
    await fetchData('/deleteBookmark', {
      params: {
        id,
      },
    });
  }

  return {
    createBookmark,
    deleteBookmark,
    downloadMedia,
    getBookmarks,
    startScan,
  };
}
