export function useBookmark() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();

  const bookmarks = useState<Bookmark[]>(STATE_KEYS.bookmarks, () => []);

  function getBookmarkPosition(trackId: string) {
    return bookmarks.value.find((bookmark) => bookmark.id === trackId)
      ?.position;
  }

  function resetBookmarks() {
    bookmarks.value = [];
  }

  async function getBookmarks() {
    const { data: bookmarksData } = await fetchData('/getBookmarks', {
      transform: /* istanbul ignore next -- @preserve */ (response) =>
        (response.bookmarks.bookmark || [])
          .filter((item) => !!item.entry)
          .map((bookmark) => ({
            ...bookmark.entry,
            position: bookmark.position,
          }))
          .filter((bookmark) =>
            ['podcast', 'podcastepisode'].includes(bookmark.type!),
          )
          .map(formatBookmark),
    });

    bookmarks.value = bookmarksData || [];
  }

  async function createBookmark(id: string, position: number) {
    await fetchData('/createBookmark', {
      method: 'POST',
      query: {
        id,
        position: Math.floor(position * 1000),
      },
    });

    getBookmarks();
  }

  async function deleteBookmark(id: string, showMessage = true) {
    const { data: bookmarkData } = await fetchData('/deleteBookmark', {
      query: {
        id,
      },
    });

    if (bookmarkData && showMessage) {
      addSuccessSnack('Successfully deleted bookmark.');
    }

    getBookmarks();
  }

  return {
    bookmarks,
    createBookmark,
    deleteBookmark,
    getBookmarkPosition,
    getBookmarks,
    resetBookmarks,
  };
}
