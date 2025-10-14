import type { Page, TestInfo } from '@playwright/test';

import { test } from '@nuxt/test-utils/playwright';

const TEST_SETTINGS = {
  loginDetails: {
    password: 'demodemo',
    server: 'https://demo.ampache.dev',
    username: 'demo',
  },
  videoPath: 'docs/videos',
};

async function goToAlbumPage(page: Page, device: string) {
  await goToPage(page, 5, device);
  await goToSubPage(page);
}

async function goToArtistPage(page: Page, device: string) {
  await goToPage(page, 6, device);
  await goToSubPage(page);
}

async function goToPage(page: Page, index: number, device: string) {
  const tag = device === 'mobile' ? 'mobileOnly' : 'desktopOnly';

  await page.locator(`aside .${tag} ul a`).nth(index).click();
  await page.waitForTimeout(10000);
}

async function goToPagesDesktop(page: Page, device: string) {
  for (const index of [0, 2, 4, 7, 9, 10]) {
    await goToPage(page, index, device);
  }

  await goToAlbumPage(page, device);
  await goToArtistPage(page, device);
  await goToPodcastsPageDesktop(page, device);
}

async function goToPagesMobile(page: Page, device: string) {
  for (const index of [0, 1, 3, 0]) {
    await goToPage(page, index, device);
  }

  await goToPodcastsPageMobile(page);
}

async function goToPodcastsPageDesktop(page: Page, device: string) {
  await goToPage(page, 1, device);
  await goToSubPage(page);
}

async function goToPodcastsPageMobile(page: Page) {
  await page.locator('.main nav a').nth(1).click();
  await goToSubPage(page);
}

async function goToSubPage(page: Page) {
  await page.locator('section article a').first().click();
  await page.waitForTimeout(10000);
}

async function login(page: Page, isDark = false) {
  await page.goto('/login', { waitUntil: 'load' });

  if (isDark) {
    await selectDarkThemeMode(page);
  }

  await page.getByLabel('Server').fill(TEST_SETTINGS.loginDetails.server);
  await page.getByLabel('Username').fill(TEST_SETTINGS.loginDetails.username);
  await page.getByLabel('password').fill(TEST_SETTINGS.loginDetails.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('/', { waitUntil: 'load' });
}

async function playMusic(page: Page, device: string) {
  const currentTrackIndex = device === 'mobile' ? 1 : 2;

  await page.locator('[title="Play podcast episodes"]').click();
  await page
    .locator('[title="Pause current track"]')
    .nth(currentTrackIndex)
    .click();

  const queueIndex = device === 'mobile' ? 0 : 1;

  await page.locator('[title="Open queue"]').nth(queueIndex).click();
  await page.locator('.queueWrapper [title="Open queue list"]').click();
  await page.waitForTimeout(5000);
  await page.locator('[title="Clear queue"]').click();
}

async function runTest(page: Page, workerInfo: TestInfo, isDark = false) {
  const device = workerInfo.project.name;

  await login(page, isDark);

  const goToPages = device === 'mobile' ? goToPagesMobile : goToPagesDesktop;

  await goToPages(page, device);
  await playMusic(page, device);
  await page.close();
  await saveVideo(page, device, isDark);
}

async function saveVideo(page: Page, device: string, isDark = false) {
  const fullPath = `${TEST_SETTINGS.videoPath}/${device}${isDark ? '-dark' : '-light'}.mp4`;

  try {
    await page.video()?.saveAs(fullPath);
    await page.video()?.delete();
  } catch (error) {
    console.error('Error saving video:', error);
  }
}

async function selectDarkThemeMode(page: Page) {
  await page.locator('[title="Activate dark mode"]').click();
  await page.waitForTimeout(500);
}

test('Dark Theme', async ({ page }, workerInfo) => {
  await runTest(page, workerInfo, true);
});

test('Light Theme', async ({ page }, workerInfo) => {
  await runTest(page, workerInfo);
});
