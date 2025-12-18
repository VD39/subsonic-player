export function useBookmark() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();

  const bookmarks = useState<Bookmark[]>(STATE_NAMES.bookmarks, () => []);

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
    const { data: bookmarkData } = await fetchData('/createBookmark', {
      method: 'POST',
      query: {
        id,
        position,
      },
    });

    if (bookmarkData) {
      await getBookmarks();
    }
  }

  async function deleteBookmark(id: string, showMessage = true) {
    const { data: bookmarkData } = await fetchData('/deleteBookmark', {
      query: {
        id,
      },
    });

    if (bookmarkData) {
      await getBookmarks();

      if (showMessage) {
        addSuccessSnack('Successfully deleted bookmark.');
      }
    }
  }

  return {
    bookmarks,
    createBookmark,
    deleteBookmark,
    getBookmarks,
    resetBookmarks,
  };
}
