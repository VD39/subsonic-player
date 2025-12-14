/**
 * webOS TV Remote Control & DPAD Navigation Plugin
 *
 * This plugin provides TV-friendly navigation using the remote control's
 * directional pad (DPAD) and action buttons.
 *
 * Features:
 * - Arrow key navigation (up/down/left/right)
 * - Enter/OK key for activation
 * - Back button support (webOS key code 461)
 * - Spatial navigation between focusable elements
 * - Only active on webOS (file:// protocol)
 */

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined') {
    return;
  }

  // Check if we're on webOS (file:// protocol) or testing mode (?webos=true)
  const isWebOS =
    window.location.protocol === 'file:' ||
    window.location.search.includes('webos=true');

  // Only activate for webOS TV environment
  if (!isWebOS) {
    return;
  }

  // Check if we're on a file system path and need to redirect
  const currentPath = window.location.pathname;
  if (currentPath.includes('/media/')) {
    const router = useRouter();
    router.replace('/');
  }

  // Add webosTV class to body for TV-specific CSS styles
  document.body.classList.add('webosTV');

  // Setup search input toggle behavior for TV (with retry logic)
  const setupSearchToggle = () => {
    let searchExpanded = false;
    let isProcessing = false; // Prevent double-click

    // Find search input first, then traverse to form (avoid :has() selector)
    const searchInput = document.getElementById(
      'search-input',
    ) as HTMLInputElement;
    const searchForm = searchInput?.closest('form') as HTMLFormElement;
    const searchWrapper = searchInput?.parentElement as HTMLElement;
    const searchButton = searchForm?.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    if (!searchForm || !searchInput || !searchButton || !searchWrapper) {
      // Retry after DOM is ready
      setTimeout(setupSearchToggle, 500);
      return;
    }

    // Add a custom class to the wrapper for targeting with CSS
    searchWrapper.classList.add('webos-search-wrapper');

    // Handle search button click with debounce
    searchButton.addEventListener('click', (evt) => {
      // Prevent double-firing from TV remote
      if (isProcessing) {
        evt.preventDefault();
        return;
      }

      if (!searchExpanded) {
        // Expand search input
        evt.preventDefault();
        isProcessing = true;
        searchExpanded = true;
        searchForm.classList.add('searchExpanded');

        // Small delay before allowing next action and focusing
        setTimeout(() => {
          searchInput.focus();
          searchInput.select();
          isProcessing = false;
        }, 100);
      } else {
        // If expanded, let the form submit normally (search)
        // Don't prevent default - let form submit
      }
    });

    // Handle focus loss to collapse search
    searchInput.addEventListener('blur', () => {
      if (searchExpanded) {
        searchExpanded = false;
        searchForm.classList.remove('searchExpanded');
      }
    });

    // Keep search button from triggering blur when clicking it
    searchButton.addEventListener('mousedown', (evt) => {
      if (searchExpanded) {
        evt.preventDefault(); // Prevent blur
      }
    });
  };

  setupSearchToggle();

  // Force tablet responsive design by setting viewport to tablet width
  // This triggers CSS media queries like @media (width >= 769px) for --tablet-up
  // but we disable hover effects via CSS since TV has no mouse
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=1024, initial-scale=1');
  }

  /**
   * Check if we're on an individual album/artist/playlist detail page
   * vs a list/discovery view
   */
  function isOnDetailPage(): boolean {
    const path = window.location.pathname;
    // Individual detail pages (not plural)
    return (
      path.startsWith('/album/') ||
      path.startsWith('/artist/') ||
      path.startsWith('/playlist/') ||
      path.startsWith('/podcast/')
    );
  }

  /**
   * Check if an element should be skipped for TV navigation
   * We skip links inside layoutContent (album titles, artist names)
   * to allow jumping directly between album images
   */
  function shouldSkipElement(element: Element): boolean {
    // Skip all elements inside track seeker (progress bar) - use skip buttons instead
    if (element.closest('[class*="trackSeeker"]')) {
      return true;
    }

    // Skip links/buttons inside layoutContent (album title, artist links)
    const layoutContent = element.closest('.layoutContent');
    if (layoutContent) {
      return true;
    }

    // Skip elements inside hidden action buttons (play/favourite on album hover)
    // These are the buttons that appear on hover in the album grid
    const actions = element.closest('[class*="actions"]');
    if (actions) {
      return true;
    }

    return false;
  }

  /**
   * Check if an element is visible
   */
  function isVisible(element: Element): boolean {
    if (!element) return false;
    const el = element as HTMLElement;

    // Check if element or its parent has dimensions
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      // For swiper slides: only consider visible if the slide is mostly in viewport
      // This prevents navigating to off-screen slides which would trigger scroll-snap
      const swiperSlide = el.closest('swiper-slide');
      if (swiperSlide) {
        const slideRect = swiperSlide.getBoundingClientRect();
        const viewportWidth =
          window.innerWidth || document.documentElement.clientWidth;

        // Check if slide is mostly visible (at least 50% in viewport)
        const visibleLeft = Math.max(slideRect.left, 0);
        const visibleRight = Math.min(slideRect.right, viewportWidth);
        const visibleWidth = Math.max(0, visibleRight - visibleLeft);

        if (visibleWidth < slideRect.width * 0.1) {
          return false;
        }
      }
      return true;
    }

    // Fallback to offset dimensions
    if (el.offsetWidth > 0 && el.offsetHeight > 0) {
      return true;
    }

    // For anchor tags, check if they have visible children
    if (el.tagName === 'A') {
      const firstChild = el.firstElementChild;
      if (firstChild) {
        const childRect = firstChild.getBoundingClientRect();
        return childRect.width > 0 && childRect.height > 0;
      }
    }

    return false;
  }

  /**
   * Get all focusable elements on the page
   */
  function getFocusableElements(): HTMLElement[] {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]',
      '.focusable',
    ].join(',');

    const elements = document.querySelectorAll(selectors);
    const filtered = Array.from(elements).filter(
      (el) => isVisible(el) && !shouldSkipElement(el),
    ) as HTMLElement[];

    return filtered;
  }

  /**
   * Find the index of the current element in the focusable list
   */
  function findCurrentIndex(
    allElements: HTMLElement[],
    currentNode: Element | null,
  ): number {
    if (!currentNode) return -1;
    for (let i = 0; i < allElements.length; i++) {
      if (currentNode.isEqualNode(allElements[i])) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Get element's bounding rect with some useful computed properties
   */
  function getElementRect(el: HTMLElement): {
    centerX: number;
    centerY: number;
    rect: DOMRect;
  } {
    const rect = el.getBoundingClientRect();
    return {
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      rect,
    };
  }

  /**
   * Check if two elements overlap on an axis (with tolerance)
   */
  function hasOverlap(
    aStart: number,
    aEnd: number,
    bStart: number,
    bEnd: number,
    tolerance: number = 0,
  ): boolean {
    return aStart - tolerance < bEnd && aEnd + tolerance > bStart;
  }

  /**
   * Navigate to the nearest element in a direction
   * Uses a more predictable algorithm that prioritizes:
   * 1. Elements that are aligned (overlap on the perpendicular axis)
   * 2. Distance in the primary direction
   */
  function navigateSpatial(
    direction: 'down' | 'left' | 'right' | 'up',
  ): boolean {
    const allElements = getFocusableElements();
    if (allElements.length === 0) return false;

    const currentElement = document.activeElement as HTMLElement;

    // If no element is focused or body is focused, focus the first element
    if (
      !currentElement ||
      currentElement === document.body ||
      !isVisible(currentElement)
    ) {
      navigationInit();
      return true;
    }

    const current = getElementRect(currentElement);
    const isHorizontal = direction === 'left' || direction === 'right';

    let bestElement: HTMLElement | null = null;
    let bestScore = Infinity;
    let bestIsAligned = false;

    for (const element of allElements) {
      if (element === currentElement) continue;

      const target = getElementRect(element);

      // Calculate distances
      const dx = target.centerX - current.centerX;
      const dy = target.centerY - current.centerY;

      // Check if element is in the correct direction (with small threshold)
      let isInDirection = false;
      let primaryDistance = 0;

      switch (direction) {
        case 'down':
          isInDirection = target.rect.top > current.rect.bottom - 10;
          primaryDistance = target.rect.top - current.rect.bottom;
          break;
        case 'left':
          isInDirection = target.rect.right < current.rect.left + 10;
          primaryDistance = current.rect.left - target.rect.right;
          break;
        case 'right':
          isInDirection = target.rect.left > current.rect.right - 10;
          primaryDistance = target.rect.left - current.rect.right;
          break;
        case 'up':
          isInDirection = target.rect.bottom < current.rect.top + 10;
          primaryDistance = current.rect.top - target.rect.bottom;
          break;
      }

      if (!isInDirection || primaryDistance < 0) continue;

      // Check alignment - elements that overlap on perpendicular axis are preferred
      let isAligned: boolean;
      let perpendicularDistance: number;

      if (isHorizontal) {
        // For left/right: check vertical overlap
        isAligned = hasOverlap(
          current.rect.top,
          current.rect.bottom,
          target.rect.top,
          target.rect.bottom,
          5, // 5px tolerance
        );
        perpendicularDistance = Math.abs(dy);
      } else {
        // For up/down: check horizontal overlap
        isAligned = hasOverlap(
          current.rect.left,
          current.rect.right,
          target.rect.left,
          target.rect.right,
          5, // 5px tolerance
        );
        perpendicularDistance = Math.abs(dx);
      }

      // Calculate score
      // Aligned elements get a huge bonus (lower score)
      // Primary distance is the main factor, perpendicular is secondary
      let score: number;

      if (isAligned) {
        // Aligned: primarily care about distance in the navigation direction
        score = primaryDistance + perpendicularDistance * 0.1;
      } else {
        // Not aligned: heavily penalize perpendicular distance
        score = primaryDistance + perpendicularDistance * 5;
      }

      // Prefer aligned elements even if slightly farther away
      const isBetterChoice =
        (isAligned && !bestIsAligned) ||
        (isAligned === bestIsAligned && score < bestScore);

      if (isBetterChoice) {
        bestScore = score;
        bestElement = element;
        bestIsAligned = isAligned;
      }
    }

    if (bestElement) {
      bestElement.focus();

      // Don't call scrollIntoView for swiper elements - it triggers swiper's
      // group-based scroll-snap and causes the view to jump entire pages.
      // Just focus the element; browsers naturally ensure focused elements are visible.
      const isInSwiper = bestElement.closest('swiper-slide');
      if (!isInSwiper) {
        bestElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
      return true;
    }

    return false;
  }

  /**
   * Simple linear navigation (fallback)
   */
  function navigateLinear(amount: number): void {
    const allElements = getFocusableElements();

    if (allElements.length === 0) return;

    const currentElement = document.activeElement;

    if (
      !currentElement ||
      currentElement === document.body ||
      !isVisible(currentElement)
    ) {
      navigationInit();
      return;
    }

    const currentIndex = findCurrentIndex(allElements, currentElement);
    let newIndex = currentIndex + amount;

    // Wrap around
    if (newIndex < 0) newIndex = allElements.length - 1;
    if (newIndex >= allElements.length) newIndex = 0;

    if (allElements[newIndex]) {
      allElements[newIndex].focus();

      // Don't call scrollIntoView for swiper elements - it triggers swiper's
      // group-based scroll-snap and causes the view to jump entire pages.
      // Just focus the element; browsers naturally ensure focused elements are visible.
      const isInSwiper = allElements[newIndex].closest('swiper-slide');
      if (!isInSwiper) {
        allElements[newIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }
  }

  /**
   * Handle arrow key navigation
   */
  function handleArrowUp(): void {
    if (!navigateSpatial('up')) {
      navigateLinear(-1);
    }
  }

  function handleArrowDown(): void {
    if (!navigateSpatial('down')) {
      navigateLinear(1);
    }
  }

  function handleArrowLeft(): void {
    if (!navigateSpatial('left')) {
      navigateLinear(-1);
    }
  }

  function handleArrowRight(): void {
    if (!navigateSpatial('right')) {
      navigateLinear(1);
    }
  }

  /**
   * Handle back button
   */
  function handleBack(): void {
    // Try to use webOS platform back if available
    if (
      'webOS' in window &&
      (window as unknown as { webOS?: { platformBack?: () => void } }).webOS
        ?.platformBack
    ) {
      (
        window as unknown as { webOS: { platformBack: () => void } }
      ).webOS.platformBack();
      return;
    }

    // Otherwise use browser history
    const router = useRouter();
    if (window.history.length > 1) {
      router.back();
    }
  }

  /**
   * Handle OK/Enter button
   */
  function handleOK(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      // For checkboxes, toggle the checked state
      if (
        activeElement instanceof HTMLInputElement &&
        activeElement.type === 'checkbox'
      ) {
        activeElement.checked = !activeElement.checked;
        activeElement.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }

      // For other elements, trigger a click
      activeElement.click();
    }
  }

  /**
   * Initialize navigation - focus the first visible focusable element
   */
  function navigationInit(): void {
    const allElements = getFocusableElements();
    const isDetailPage = isOnDetailPage();

    // On detail pages (album, artist, playlist), prioritize Play All button
    if (isDetailPage) {
      // Try to find Play All button by ID first
      const playAllButton = document.getElementById('play-all-button');
      if (playAllButton && isVisible(playAllButton)) {
        playAllButton.focus();
        return;
      }

      // Fallback: find any button with "play" in text (case insensitive)
      const buttons = document.querySelectorAll('button');
      for (const button of buttons) {
        if (
          button.textContent?.toLowerCase().includes('play') &&
          isVisible(button) &&
          !shouldSkipElement(button)
        ) {
          button.focus();
          return;
        }
      }
    }

    // Try to find a good initial element to focus
    // Priority: 1) buttons with specific classes, 2) first input, 3) first focusable
    const prioritySelectors = [
      'button[type="submit"]',
      'input:not([type="hidden"])',
      'a[href]',
      'button',
    ];

    for (const selector of prioritySelectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element && isVisible(element)) {
        element.focus();
        return;
      }
    }

    // Fallback to first focusable element
    if (allElements.length > 0) {
      allElements[0].focus();
    }
  }

  /**
   * Main keydown event handler
   */
  function onKeyDown(evt: KeyboardEvent): void {
    const keyCode = evt.keyCode;

    // Log for debugging

    switch (keyCode) {
      case 10009: // Samsung/Tizen Back button
      case 461: // webOS Back button
        evt.preventDefault();
        handleBack();
        break;
      case 13: // Enter/OK
        // Don't prevent default for form inputs
        if (
          !(document.activeElement instanceof HTMLInputElement) ||
          document.activeElement.type === 'checkbox'
        ) {
          evt.preventDefault();
        }
        handleOK();
        break;
      case 27: // Escape
        evt.preventDefault();
        handleBack();
        break;
      case 37: // Left Arrow
        evt.preventDefault();
        handleArrowLeft();
        break;
      case 38: // Up Arrow
        evt.preventDefault();
        handleArrowUp();
        break;
      case 39: // Right Arrow
        evt.preventDefault();
        handleArrowRight();
        break;
      case 40: // Down Arrow
        evt.preventDefault();
        handleArrowDown();
        break;
      case 8: // Backspace (as back in some contexts)
        // Only handle as back if not in an input field
        if (
          !(document.activeElement instanceof HTMLInputElement) &&
          !(document.activeElement instanceof HTMLTextAreaElement)
        ) {
          evt.preventDefault();
          handleBack();
        }
        break;
    }
  }

  // Add keydown event listener
  document.addEventListener('keydown', onKeyDown);

  // Initialize focus when page loads
  setTimeout(navigationInit, 200);

  // Re-initialize when route changes
  nuxtApp.hook('page:finish', () => {
    setTimeout(navigationInit, 200);
  });

  // Also re-initialize on page transitions
  nuxtApp.hook('page:transition:finish', () => {
    setTimeout(navigationInit, 200);
  });

  // Watch for DOM changes and re-initialize if needed
  const observer = new MutationObserver(() => {
    // Only re-focus if current focus is invalid
    const activeElement = document.activeElement;
    if (
      !activeElement ||
      activeElement === document.body ||
      !isVisible(activeElement)
    ) {
      setTimeout(navigationInit, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
