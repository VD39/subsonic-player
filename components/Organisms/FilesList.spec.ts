import type { VueWrapper } from '@vue/test-utils';

import { mount, RouterLinkStub } from '@vue/test-utils';

import FileListItem from '@/components/Organisms/FileListItem.vue';
import { getFormattedTracksMock } from '@/test/helpers';

import FilesList from './FilesList.vue';

const routeMock = ref<Record<string, unknown>>({
  params: {
    id: null,
  },
});

const tracks = getFormattedTracksMock(5);
const track = tracks[0];

function factory(props = {}) {
  return mount(FilesList, {
    global: {
      mocks: {
        $route: routeMock.value,
      },
    },
    props: {
      folders: [],
      tracks: [],
      ...props,
    },
  });
}

describe('FilesList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when route params does not have an Id', () => {
    it('does not show go back element', () => {
      expect(wrapper.find({ ref: 'goBack' }).exists()).toBe(false);
    });
  });

  describe('when route params does have an Id', () => {
    beforeEach(() => {
      routeMock.value = {
        fullPath: '/files/0/al-1/al-2/al-3',
        params: {
          id: 'id',
        },
      };

      wrapper = factory();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the go back element', () => {
      expect(wrapper.find({ ref: 'goBack' }).exists()).toBe(true);
    });

    it('sets the correct to prop on the RouterLinkStub component', () => {
      expect(
        wrapper
          .find({ ref: 'goBack' })
          .findComponent(RouterLinkStub)
          .props('to'),
      ).toBe('/files/0/al-1/al-2');
    });
  });

  describe('when folders and tracks prop are empty array', () => {
    it('does not show the folders content', () => {
      expect(wrapper.find('[data-test-id="folder"]').exists()).toBe(false);
    });

    it('does not show the tracks content', () => {
      expect(wrapper.findComponent(FileListItem).exists()).toBe(false);
    });

    it('shows the no folder files element', () => {
      expect(wrapper.find({ ref: 'noFoldersFiles' }).exists()).toBe(true);
    });
  });

  describe('when folders is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        folders: tracks,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the correct number of folder items', () => {
      expect(wrapper.findAll('[data-test-id="folder"]').length).toBe(5);
    });

    it('does not show the no folder files element', () => {
      expect(wrapper.find({ ref: 'noFoldersFiles' }).exists()).toBe(false);
    });
  });

  describe('when tracks is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        tracks,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the correct number of track items', () => {
      expect(wrapper.findAllComponents(FileListItem).length).toBe(5);
    });

    it('does not show the no folder files element', () => {
      expect(wrapper.find({ ref: 'noFoldersFiles' }).exists()).toBe(false);
    });

    describe.each([
      ['addToPlaylist', [track.id]],
      ['mediaInformation', [track]],
      ['downloadMedia', [track]],
      ['addToQueue', [track]],
      ['playTrack', [0]],
    ])(
      'when the FileListItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(async () => {
          wrapper.findComponent(FileListItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );
  });
});
