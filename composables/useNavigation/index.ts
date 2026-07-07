export function useNavigation() {
  const route = useRoute();
  const { showPodcasts, showRadioStations } = useSettings();

  function isNavigationVisible(item: NavigationItem) {
    const name = getRouteName(item.to as ToProp);

    if (name === ROUTE_NAMES.podcasts || name === ROUTE_NAMES.bookmarks) {
      return showPodcasts.value;
    }

    if (name === ROUTE_NAMES.radioStations) {
      return showRadioStations.value;
    }

    return true;
  }

  const sidebarNavigation = computed<NavigationGroup[]>(() =>
    SIDEBAR_DESKTOP_NAVIGATION.map((group) => ({
      ...group,
      items: group.items.filter(isNavigationVisible),
    })),
  );

  const mobileNavigation = computed(() =>
    MOBILE_NAVIGATION.filter(isNavigationVisible),
  );

  const mobilePageNavigation = computed<PageNavigationMap>(() =>
    Object.fromEntries(
      Object.entries(MOBILE_PAGE_NAVIGATION).filter(([, to]) =>
        isNavigationVisible({ to } as NavigationItem),
      ),
    ),
  );

  const mobileTabRoutes = computed(() => {
    const routes: RouteName[] = [ROUTE_NAMES.index];

    if (showPodcasts.value) {
      routes.push(ROUTE_NAMES.podcast, ROUTE_NAMES.podcasts);
    }

    if (showRadioStations.value) {
      routes.push(ROUTE_NAMES.radioStations);
    }

    return routes;
  });

  const showPageNavigation = computed(
    () =>
      mobileTabRoutes.value.length > 1 &&
      mobileTabRoutes.value.includes(route.name as RouteName),
  );

  return {
    mobileNavigation,
    mobilePageNavigation,
    mobileTabRoutes,
    showPageNavigation,
    sidebarNavigation,
  };
}
