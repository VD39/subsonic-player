export function useMediaLibrary() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();

  async function startScan() {
    const { data: startScanData } = await fetchData('/startScan', {
      params: {
        noLoading: true,
      },
    });

    if (startScanData) {
      addSuccessSnack('Scan started.');
    }
  }

  /* istanbul ignore next -- @preserve */
  async function getBookmarks() {
    await fetchData('/getBookmarks', {
      params: {
        noLoading: true,
      },
    });
  }

  /* istanbul ignore next -- @preserve */
  async function createBookmark() {
    await fetchData('/createBookmark', {
      method: 'POST',
      params: {
        noLoading: true,
      },
    });
  }

  /* istanbul ignore next -- @preserve */
  async function deleteBookmark() {
    await fetchData('/deleteBookmark', {
      params: {
        noLoading: true,
      },
    });
  }

  /* istanbul ignore next -- @preserve */
  async function getPlayQueue() {
    await fetchData('/getPlayQueue', {
      params: {
        noLoading: true,
      },
    });
  }

  /* istanbul ignore next -- @preserve */
  async function savePlayQueue() {
    await fetchData('/savePlayQueue', {
      method: 'POST',
      params: {
        noLoading: true,
      },
    });
  }

  return {
    createBookmark,
    deleteBookmark,
    getBookmarks,
    getPlayQueue,
    savePlayQueue,
    startScan,
  };
}
