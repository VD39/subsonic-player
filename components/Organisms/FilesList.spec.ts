import type { VueWrapper } from '@vue/test-utils';

import { mount, RouterLinkStub } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedTracksMock } from '@/test/helpers';

import FilesList from './FilesList.vue';

const routeMock = ref<Record<string, unknown>>({
  params: {
    id: null,
  },
});

const tracks = getFormattedTracksMock(5);
const track = tracks[0];

async function factory(props = {}) {
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

  await wrapper.vm.$nextTick();

  const dropdownMenu = wrapper.findComponent(DropdownMenu);

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
}

describe('FilesList', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await factory();
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
    beforeEach(async () => {
      routeMock.value = {
        fullPath: '/files/0/al-1/al-2/al-3',
        params: {
          id: 'id',
        },
      };

      wrapper = await factory();
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
    beforeEach(async () => {
      wrapper = await factory({
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
    beforeEach(async () => {
      wrapper = await factory({
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

    describe.each([
      [
        'add to playlist DropdownItem',
        'addToPlaylist',
        'addToPlaylist',
        [track.id],
      ],
      [
        'media information DropdownItem',
        'mediaInformation',
        'mediaInformation',
        [track],
      ],
      [
        'download media DropdownItem',
        'downloadMedia',
        'downloadMedia',
        [track],
      ],
      ['add to queue DropdownItem', 'addToQueue', 'addToQueue', [track]],
      ['play track DropdownItem', 'playTrack', 'playTrack', [0]],
    ])(
      'when the %s component emits the click event',
      (_text, ref, emitEventName, expectedArgs) => {
        beforeEach(async () => {
          wrapper.findComponent({ ref }).vm.$emit('click');
        });

        it(`emits the ${emitEventName} event with the correct value`, () => {
          expect(wrapper.emitted(emitEventName)).toEqual([expectedArgs]);
        });
      },
    );

    describe('when the TrackPlayPause component emits the playTrack event', () => {
      beforeEach(async () => {
        wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
      });

      it('emits the playTrack event with track', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[0]]);
      });
    });
  });
});
