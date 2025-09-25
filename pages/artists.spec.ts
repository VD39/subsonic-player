import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import { getFormattedArtistsMock } from '@/test/helpers';
import { useHeadMock } from '@/test/useHeadMock';

import ArtistsPage from './artists.vue';

mockNuxtImport('useAsyncData', () => () => ({
  data: ref({
    artists: getFormattedArtistsMock(3),
  }),
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();

function factory(props = {}) {
  return mount(ArtistsPage, {
    props: {
      ...props,
    },
  });
}

describe('artists', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the useHead function with correct title', () => {
    expect(useHeadTitleMock.value).toBe('Artists');
  });
});
