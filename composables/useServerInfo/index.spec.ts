import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import type { DataMock } from '@/test/types';

import { serverInformationMock } from '@/test/fixtures';

import { useServerInfo } from './index';

const fetchDataMock = vi.fn<() => DataMock>(() => ({
  data: null,
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: fetchDataMock,
}));

const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  openModal: openModalMock,
}));

const userMock = ref<null | Partial<User>>({
  server: null,
});

mockNuxtImport('useUser', () => () => ({
  user: userMock,
}));

const config = vi.hoisted(() => ({
  public: {
    APP_GITHUB_URL: 'https://github.com/url',
    APP_RELEASE_DATE: 'Jan 02, 2025',
    APP_VERSION: '2.5.0',
  },
}));

mockNuxtImport('useRuntimeConfig', () => () => config);

const { openAboutAppModal } = useServerInfo();

describe('useServerInfo', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the openAboutAppModal function is called', () => {
    beforeEach(async () => {
      fetchDataMock.mockResolvedValue({
        data: serverInformationMock,
      });

      await openAboutAppModal();
    });

    it('calls fetchData with the correct path', () => {
      expect(fetchDataMock).toHaveBeenCalledWith('/ping', {
        transform: expect.any(Function),
      });
    });

    describe('when the user server is null', () => {
      it('calls the openModal function with the correct parameters', () => {
        expect(openModalMock).toHaveBeenCalledWith(MODAL_TYPE.aboutAppModal, {
          appInformation: {
            bugReportUrl: 'https://github.com/url/issues/new',
            githubReleaseUrl: 'https://github.com/url/releases',
            githubUrl: 'https://github.com/url',
            homepageUrl: 'https://github.com/url',
            releaseDate: 'Jan 02, 2025',
            version: '2.5.0',
          },
          serverInformation: {
            name: 'type',
            openSubsonic: 'Yes',
            url: '',
            version: '1.16.1',
          },
        });
      });
    });

    describe('when the user server is not null', () => {
      beforeEach(async () => {
        userMock.value = {
          server: 'https://www.server.com',
        };

        await openAboutAppModal();
      });

      it('calls the openModal function with the correct parameters', () => {
        expect(openModalMock).toHaveBeenCalledWith(MODAL_TYPE.aboutAppModal, {
          appInformation: {
            bugReportUrl: 'https://github.com/url/issues/new',
            githubReleaseUrl: 'https://github.com/url/releases',
            githubUrl: 'https://github.com/url',
            homepageUrl: 'https://github.com/url',
            releaseDate: 'Jan 02, 2025',
            version: '2.5.0',
          },
          serverInformation: {
            name: 'type',
            openSubsonic: 'Yes',
            url: 'https://www.server.com',
            version: '1.16.1',
          },
        });
      });
    });
  });
});
