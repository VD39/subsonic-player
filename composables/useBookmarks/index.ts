export function useBookmarks() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();

  const bookmarks = useState<Bookmark[]>(STATE_NAMES.bookmarks, () => []);

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
      params: {
        id,
        position,
      },
    });

    if (bookmarkData) {
      await getBookmarks();
    }
  }

  async function deleteBookmark(id: string) {
    const { data: bookmarkData } = await fetchData('/deleteBookmark', {
      params: {
        id,
      },
    });

    if (bookmarkData) {
      addSuccessSnack('Successfully deleted bookmark.');
      await getBookmarks();
    }
  }

  return {
    bookmarks,
    createBookmark,
    deleteBookmark,
    getBookmarks,
  };
}
