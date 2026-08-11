import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { serverInformationMock } from '@/test/fixtures';

import { useServerInfo } from './index';

const fetchDataMock = vi.hoisted(() =>
  vi.fn<() => DataMock>(() => ({
    data: null,
  })),
);

mockNuxtImport('useAPI', (original) => () => ({
  ...original(),
  fetchData: fetchDataMock,
}));

const userMock = ref<null | Partial<User>>({
  server: null,
});

mockNuxtImport('useUser', (original) => () => ({
  ...original(),
  user: userMock,
}));

const config = vi.hoisted(() => ({
  public: {
    APP_GITHUB_URL: 'https://github.com/url',
    APP_RELEASE_DATE: 'Jan 02, 2025',
    APP_VERSION: '2.5.0',
  },
}));

mockNuxtImport('useRuntimeConfig', (original) => () => ({
  ...original(),
  ...config,
}));

describe('useServerInfo', () => {
  let composable: ReturnType<typeof useServerInfo>;

  beforeAll(() => {
    composable = useServerInfo();
  });

  it('sets the default aboutInformation value', () => {
    expect(composable.aboutInformation.value).toBeNull();
  });

  describe('when the fetchInformation function is called', () => {
    describe('when the fetchData response returns null', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: null,
        });

        await composable.fetchInformation();
      });

      it('calls the fetchData function with the correct parameters', () => {
        expect(fetchDataMock).toHaveBeenCalledWith('/ping', {
          transform: expect.any(Function),
        });
      });

      it('sets the correct aboutInformation value', () => {
        expect(composable.aboutInformation.value).toEqual({
          appInformation: {
            bugReportUrl: 'https://github.com/url/issues/new',
            githubReleaseUrl: 'https://github.com/url/releases',
            githubUrl: 'https://github.com/url',
            homepageUrl: 'https://github.com/url',
            releaseDate: 'Jan 02, 2025',
            version: '2.5.0',
          },
          serverInformation: {
            url: '',
          },
        });
      });
    });

    describe('when the fetchData response returns server information', () => {
      beforeEach(async () => {
        fetchDataMock.mockResolvedValue({
          data: serverInformationMock,
        });

        await composable.fetchInformation();
      });

      it('sets the correct aboutInformation value', () => {
        expect(composable.aboutInformation.value).toEqual({
          appInformation: {
            bugReportUrl: 'https://github.com/url/issues/new',
            githubReleaseUrl: 'https://github.com/url/releases',
            githubUrl: 'https://github.com/url',
            homepageUrl: 'https://github.com/url',
            releaseDate: 'Jan 02, 2025',
            version: '2.5.0',
          },
          serverInformation: {
            ...serverInformationMock,
            url: '',
          },
        });
      });

      describe('when the user server is set', () => {
        beforeEach(async () => {
          userMock.value = { server: 'https://www.server.com' };
          await composable.fetchInformation();
        });

        it('sets the correct serverInformation url value', () => {
          expect(composable.aboutInformation.value?.serverInformation.url).toBe(
            'https://www.server.com',
          );
        });
      });
    });
  });
});
