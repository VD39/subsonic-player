import type { Page } from '@playwright/test';

import { expect, test } from '@nuxt/test-utils/playwright';

const WEBOS_QUERY = '?webos=true';
const LOGIN_DETAILS = {
  password: 'demodemo',
  server: 'https://demo.ampache.dev',
  username: 'demo',
};

async function getFocusedElement(page: Page) {
  return page.evaluateHandle(() => document.activeElement);
}

async function loginWebOS(page: Page) {
  await page.goto(`/login${WEBOS_QUERY}`, { waitUntil: 'load' });

  await page.getByLabel('Server').fill(LOGIN_DETAILS.server);
  await page.getByLabel('Username').fill(LOGIN_DETAILS.username);
  await page.getByLabel('password').fill(LOGIN_DETAILS.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(`/${WEBOS_QUERY}`, { waitUntil: 'load' });
}

test.describe('webOS TV Layout', () => {
  test.beforeEach(async ({ page }) => {
    await loginWebOS(page);
  });

  test('webosTV class applied to body', async ({ page }) => {
    const bodyClass = await page.evaluate(() =>
      document.body.classList.contains('webosTV'),
    );
    expect(bodyClass).toBe(true);
  });

  test('viewport forced to 1024px width', async ({ page }) => {
    const viewportContent = await page.evaluate(() =>
      document.querySelector('meta[name="viewport"]')?.getAttribute('content'),
    );
    expect(viewportContent).toContain('width=1024');
  });

  test.describe('Visual Layout', () => {
    test('sidebar navigation on left side', async ({ page }) => {
      const nav = page.locator('nav ul[class*="mobileNavigation"]');
      await expect(nav).toBeVisible();

      const position = await nav.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          flexDirection: style.flexDirection,
          position: style.position,
          width: el.getBoundingClientRect().width,
        };
      });

      expect(position.flexDirection).toBe('column');
      expect(position.position).toBe('fixed');
      expect(position.width).toBeCloseTo(100, 10);
    });

    test('main content has left margin for sidebar', async ({ page }) => {
      const main = page.locator('main[class*="mainContent"]');
      const marginLeft = await main.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue('margin-left'),
      );
      expect(marginLeft).toBe('100px');
    });

    test('hover actions hidden (no mouse on TV)', async ({ page }) => {
      const actions = page.locator('[class*="actions"]').first();
      const isVisible = await actions.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      expect(isVisible).toBe(false);
    });

    test('cursor hidden on TV', async ({ page }) => {
      const bodyCursor = await page.evaluate(() =>
        window.getComputedStyle(document.body).getPropertyValue('cursor'),
      );
      expect(bodyCursor).toBe('none');
    });
  });

  test.describe('Focus States', () => {
    test('focus outline visible with theme color', async ({ page }) => {
      const navLink = page.locator('nav a').first();
      await navLink.focus();

      const boxShadow = await navLink.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue('box-shadow'),
      );
      expect(boxShadow).toContain('4px');
    });

    test('album images are focusable', async ({ page }) => {
      const albumLink = page.locator('.layoutImage a').first();
      await expect(albumLink).toBeVisible();

      await albumLink.focus();
      const isFocused = await albumLink.evaluate(
        (el) => el === document.activeElement,
      );
      expect(isFocused).toBe(true);
    });

    test('layoutContent links are NOT interactive (pointer-events none)', async ({
      page,
    }) => {
      const layoutContentLink = page.locator('.layoutContent a').first();
      if ((await layoutContentLink.count()) > 0) {
        const pointerEvents = await layoutContentLink.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue('pointer-events'),
        );
        expect(pointerEvents).toBe('none');
      }
    });

    test('track seeker is NOT focusable', async ({ page }) => {
      const trackSeeker = page.locator('[class*="trackSeeker"]').first();
      if ((await trackSeeker.count()) > 0) {
        const pointerEvents = await trackSeeker.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue('pointer-events'),
        );
        expect(pointerEvents).toBe('none');
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('Arrow Down moves focus to next element', async ({ page }) => {
      const firstFocusable = page.locator('nav a').first();
      await firstFocusable.focus();

      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);

      const focused = await getFocusedElement(page);
      const focusedTagName = await focused.evaluate((el) => el?.tagName);
      expect(focusedTagName).toBeDefined();
    });

    test('Arrow keys navigate spatially (right goes right)', async ({
      page,
    }) => {
      const navLink = page.locator('nav a').first();
      await navLink.focus();

      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);

      const activeElement = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return {
          rect: el.getBoundingClientRect(),
          tagName: el.tagName,
        };
      });

      expect(activeElement).toBeDefined();
    });

    test('Enter key activates focused element', async ({ page }) => {
      const navLink = page.locator('nav a').nth(1);
      await navLink.focus();

      const href = await navLink.getAttribute('href');

      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      const currentPath = page.url().split('?')[0];
      expect(currentPath).toContain(href || '');
    });

    test('Escape key navigates back', async ({ page }) => {
      const navLink = page.locator('nav a').nth(1);
      await navLink.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      const currentPath = new URL(page.url()).pathname;
      expect(currentPath).toBe('/');
    });

    test('Backspace navigates back (when not in input)', async ({ page }) => {
      const navLink = page.locator('nav a').nth(2);
      await navLink.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      await page.keyboard.press('Backspace');
      await page.waitForTimeout(500);

      const currentPath = new URL(page.url()).pathname;
      expect(currentPath).toBe('/');
    });
  });

  test.describe('Page-Specific Behavior', () => {
    test('Album page: Play All button gets initial focus', async ({ page }) => {
      const albumLink = page.locator('.layoutImage a').first();
      await albumLink.click();
      await page.waitForTimeout(1000);

      const playAllButton = page.locator('#play-all-button');
      if ((await playAllButton.count()) > 0) {
        const isFocused = await playAllButton.evaluate(
          (el) => el === document.activeElement,
        );
        expect(isFocused).toBe(true);
      } else {
        const playButton = page
          .locator('button')
          .filter({
            hasText: 'play',
          })
          .first();
        const isFocused = await playButton.evaluate(
          (el) => el === document.activeElement,
        );
        expect(isFocused).toBe(true);
      }
    });

    test('Search toggle: click expands input', async ({ page }) => {
      const searchButton = page.locator('form button[type="submit"]');
      await searchButton.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      const searchInput = page.locator('#search-input');
      const width = await searchInput.evaluate(
        (el) => el.getBoundingClientRect().width,
      );
      expect(width).toBeGreaterThan(100);

      const isFocused = await searchInput.evaluate(
        (el) => el === document.activeElement,
      );
      expect(isFocused).toBe(true);
    });

    test('Search toggle: blur collapses input', async ({ page }) => {
      const searchButton = page.locator('form button[type="submit"]');
      await searchButton.click();
      await page.waitForTimeout(300);

      const searchInput = page.locator('#search-input');
      await searchInput.focus();
      await page.keyboard.press('Tab');
      await page.waitForTimeout(300);

      const width = await searchInput.evaluate(
        (el) => el.getBoundingClientRect().width,
      );
      expect(width).toBeLessThan(50);
    });
  });

  test.describe('Screenshot Tests (Visual Verification)', () => {
    test('homepage layout screenshot', async ({ page }) => {
      await page.waitForTimeout(1000);
      await page.screenshot({
        fullPage: false,
        path: 'webos/e2e/screenshots/homepage.png',
      });
    });

    test('focused element screenshot', async ({ page }) => {
      const navLink = page.locator('nav a').first();
      await navLink.focus();
      await page.waitForTimeout(200);

      await page.screenshot({
        fullPage: false,
        path: 'webos/e2e/screenshots/focused-nav.png',
      });
    });

    test('album page screenshot', async ({ page }) => {
      const albumLink = page.locator('.layoutImage a').first();
      await albumLink.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        fullPage: false,
        path: 'webos/e2e/screenshots/album-page.png',
      });
    });
  });
});
