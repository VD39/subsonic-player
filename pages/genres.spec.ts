import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import GridWrapper from '@/components/Atoms/GridWrapper.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import { getFormattedGenresMock } from '@/test/helpers';
import { useHeadMock } from '@/test/useHeadMock';

import GenresPage from './genres.vue';

const getGenresMock = vi.fn();

mockNuxtImport('useGenre', () => () => ({
  getGenres: getGenresMock,
}));

const genresDataMock = ref<{ genres: Genre[] }>({
  genres: [],
});

mockNuxtImport('useAsyncData', () => () => ({
  data: genresDataMock,
  status: ref('success'),
}));

const { useHeadTitleMock } = useHeadMock();

function factory(props = {}) {
  return mount(GenresPage, {
    global: {
      stubs: {
        GenreLink: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('genres', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    genresDataMock.value = {
      genres: [],
    };
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the useHead function with correct title', () => {
    expect(useHeadTitleMock.value).toBe('Genres');
  });

  describe('when getGenres does not return any data', () => {
    it('does not show the GridWrapper component', () => {
      expect(wrapper.findComponent(GridWrapper).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when getGenres does return data', () => {
    beforeEach(() => {
      genresDataMock.value = {
        genres: getFormattedGenresMock(3),
      };

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the GridWrapper component', () => {
      expect(wrapper.findComponent(GridWrapper).exists()).toBe(true);
    });

    it('shows the correct number of genre items', () => {
      expect(
        wrapper
          .findComponent(GridWrapper)
          .findAll('[data-test-id="genre-item"]').length,
      ).toBe(3);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });
  });
});
