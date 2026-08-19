import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/ui/InteractionWrapper.vue';
import { formattedPodcastMock } from '@/test/fixtures';

import PodcastItem from './PodcastItem.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

const openDropdownMenuMock = vi.fn();

const podcast = formattedPodcastMock;

function factory(props = {}) {
  return mount(PodcastItem, {
    global: {
      stubs: {
        DropdownMenu: {
          methods: {
            openDropdownMenu: openDropdownMenuMock,
          },
          template: '<div><slot /></div>',
        },
      },
    },
    props: {
      podcast,
      ...props,
    },
  });
}

describe('PodcastItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe.each([
    ['play podcast ButtonLink', 'playPodcastButtonLink', 'playPodcast'],
  ])(
    'when the %s component emits the click event',
    (_text, ref, emitEventName) => {
      beforeEach(async () => {
        await wrapper.findComponent({ ref }).trigger('click');
      });

      it(`emits the ${emitEventName} event`, () => {
        expect(wrapper.emitted(emitEventName)).toEqual([[podcast]]);
      });
    },
  );

  describe.each([
    ['play podcast DropdownItem', 'playPodcast', 'playPodcast'],
    ['add to queue DropdownItem', 'addPodcastToQueue', 'addPodcastToQueue'],
    ['media information DropdownItem', 'mediaInformation', 'mediaInformation'],
  ])(
    'when the %s component emits the click event',
    (_text, ref, emitEventName) => {
      beforeEach(() => {
        wrapper.findComponent({ ref }).vm.$emit('click');
      });

      it(`emits the ${emitEventName} event`, () => {
        expect(wrapper.emitted(emitEventName)).toEqual([[podcast]]);
      });
    },
  );

  describe('when the delete podcast DropdownItem emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent({ ref: 'deletePodcast' }).vm.$emit('click');
    });

    it('emits the deletePodcast event', () => {
      expect(wrapper.emitted('deletePodcast')).toEqual([[podcast.id]]);
    });
  });

  describe('when the InteractionWrapper component emits the click event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('click');
    });

    it('calls the navigateTo function with the correct parameters', () => {
      expect(navigateToMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.podcast,
        params: {
          [ROUTE_PARAM_KEYS.podcast.id]: podcast.id,
          [ROUTE_PARAM_KEYS.podcast.sortBy]: ROUTE_PODCAST_FILTER_PARAMS.All,
        },
      });
    });
  });

  describe('when the InteractionWrapper component emits the dragStart event', () => {
    beforeEach(() => {
      wrapper
        .findComponent(InteractionWrapper)
        .vm.$emit('dragStart', DragEvent);
    });

    it('emits the dragStart event', () => {
      expect(wrapper.emitted('dragStart')).toEqual([[podcast, DragEvent]]);
    });
  });

  describe('when the InteractionWrapper component emits the contextMenu event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('contextMenu');
    });

    it('calls the openDropdownMenu function', () => {
      expect(openDropdownMenuMock).toHaveBeenCalled();
    });
  });
});
