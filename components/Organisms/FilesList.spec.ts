import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedTracksMock } from '@/test/helpers';
import { mount, RouterLinkStub } from '@vue/test-utils';

import FilesList from './FilesList.vue';

const routeMock = ref<Record<string, unknown>>({
  params: {
    id: null,
  },
});

const tracks = getFormattedTracksMock(5);

function factory(props = {}) {
  const wrapper = mount(FilesList, {
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

  const dropdownMenu = wrapper.findComponent({ ref: 'dropdownMenu' });

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
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

    it('sets the correct link attribute on go back element', () => {
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
      expect(wrapper.find('[data-test-id="track"]').exists()).toBe(false);
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
      expect(wrapper.findAll('[data-test-id="track"]').length).toBe(5);
    });

    it('does not show the no folder files element', () => {
      expect(wrapper.find({ ref: 'noFoldersFiles' }).exists()).toBe(false);
    });

    describe('when the TrackPlayPause component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
      });

      it('emits the playTrack event with track', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[0]]);
      });
    });

    describe('when the add to playlist DropdownItem component emits the click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'addToPlaylist' }).vm.$emit('click');
      });

      it('emits the addToPlaylist event with track', () => {
        expect(wrapper.emitted('addToPlaylist')).toEqual([[tracks[0].id]]);
      });
    });

    describe('when the media information DropdownItem component emits the click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'mediaInformation' }).vm.$emit('click');
      });

      it('emits the addToPlaylist event with track', () => {
        expect(wrapper.emitted('mediaInformation')).toEqual([[tracks[0]]]);
      });
    });

    describe('when the download media DropdownItem component emits the click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'downloadMedia' }).vm.$emit('click');
      });

      it('emits the downloadMedia event with track', () => {
        expect(wrapper.emitted('downloadMedia')).toEqual([[tracks[0].id]]);
      });
    });

    describe('when the add to queue DropdownItem component emits the click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'addToQueue' }).vm.$emit('click');
      });

      it('emits the addToQueue event with track', () => {
        expect(wrapper.emitted('addToQueue')).toEqual([[tracks[0]]]);
      });
    });

    describe('when the play track DropdownItem component emits the click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'playTrack' }).vm.$emit('click');
      });

      it('emits the playTrack event with track', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[0]]);
      });
    });
  });
});
