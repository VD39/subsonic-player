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

  async function getMusicFolders() {
    const { data: musicFoldersData } = await fetchData('/getMusicFolders', {
      transform: /* istanbul ignore next -- @preserve */ (response) => ({
        folders: (
          response.musicFolders.musicFolder || []
        ).map<FormattedMusicFolder>((folder) => ({
          ...folder,
          image: IMAGE_DEFAULT_BY_TYPE.folder,
        })),
        tracks: [],
      }),
    });

    return musicFoldersData || DEFAULT_MEDIA_LIBRARY;
  }

  async function getIndexes(musicFolderId: string) {
    const { data: indexesData } = await fetchData('/getIndexes', {
      params: {
        musicFolderId,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) => ({
        folders: (response.indexes.index || [])
          .flatMap((index) => index.artist!)
          .map(formatArtist),
        tracks: (response.indexes.child || []).map(formatTrack),
      }),
    });

    return indexesData || DEFAULT_MEDIA_LIBRARY;
  }

  async function getMusicDirectory(id: string) {
    const { data: musicDirectoryData } = await fetchData('/getMusicDirectory', {
      params: {
        id,
      },
      transform: /* istanbul ignore next -- @preserve */ (response) => {
        const items = response.directory.child || [];

        return {
          folders: items.filter((item) => item.isDir).map(formatTrack),
          tracks: items
            .filter((item) => !item.isDir && item.type === 'music')
            .map(formatTrack),
        };
      },
    });

    return musicDirectoryData || DEFAULT_MEDIA_LIBRARY;
  }

  function getFiles(filesParams: FilesParams = {}) {
    const { id, slug = [] } = filesParams;

    if (slug.length) {
      return getMusicDirectory(slug.at(-1) as string);
    }

    if (id) {
      return getIndexes(id);
    }

    return getMusicFolders();
  }

  /* istanbul ignore next -- @preserve */
  async function scrobble(id: string) {
    await fetchData('/scrobble', {
      params: {
        id,
      },
    });
  }

  return {
    downloadMedia,
    getFiles,
    getIndexes,
    getMusicDirectory,
    getMusicFolders,
    scrobble,
    startScan,
  };
}
