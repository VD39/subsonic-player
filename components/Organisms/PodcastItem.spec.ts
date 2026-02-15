import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import { formattedPodcastMock } from '@/test/fixtures';

import PodcastItem from './PodcastItem.vue';

const podcast = formattedPodcastMock;

const openDropdownMenuMock = vi.fn();

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

  describe('when the InteractionWrapper component emits the longPress event', () => {
    beforeEach(() => {
      wrapper.findComponent(InteractionWrapper).vm.$emit('longPress');
    });

    it('calls the openDropdownMenu function', () => {
      expect(openDropdownMenuMock).toHaveBeenCalled();
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
