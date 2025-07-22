import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedTracksMock } from '@/test/helpers';

import TracksList from './TracksList.vue';

const tracks = getFormattedTracksMock(5);
const track = tracks[0];

function factory(props = {}) {
  const wrapper = mount(TracksList, {
    props: {
      tracks,
      ...props,
    },
  });

  const dropdownMenu = wrapper.findComponent(DropdownMenu);

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
}

describe('TracksList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when tracks prop is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        tracks: [],
      });
    });

    it('does not show the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when tracks prop is not an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of track items', () => {
      expect(wrapper.findAll('[data-test-id="track"]').length).toBe(5);
    });

    it('does not show the NoMediaArtistsListMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when track.album is defined', () => {
      it('shows the MarqueeScroll component containing the album details', () => {
        expect(
          wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
        ).toBe(true);
      });

      it('does not show the album else element', () => {
        expect(wrapper.find({ ref: 'albumElse' }).exists()).toBe(false);
      });
    });

    describe('when track.album is undefined', () => {
      beforeEach(() => {
        wrapper = factory({
          tracks: getFormattedTracksMock(1, {
            album: undefined,
          }),
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the album details', () => {
        expect(
          wrapper.findComponent({ ref: 'albumMarqueeScroll' }).exists(),
        ).toBe(false);
      });

      it('shows the album else element', () => {
        expect(wrapper.find({ ref: 'albumElse' }).exists()).toBe(true);
      });
    });

    describe('when track.artists is not an empty array', () => {
      it('shows the MarqueeScroll component containing the artists details', () => {
        expect(
          wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
        ).toBe(true);
      });

      it('does not show the artists else element', () => {
        expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(false);
      });
    });

    describe('when track.artists is an empty array', () => {
      beforeEach(() => {
        wrapper = factory({
          tracks: getFormattedTracksMock(1, {
            artists: [],
          }),
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the MarqueeScroll component containing the artists details', () => {
        expect(
          wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
        ).toBe(false);
      });

      it('shows the artists else element', () => {
        expect(wrapper.find({ ref: 'artistsElse' }).exists()).toBe(true);
      });
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
        beforeEach(() => {
          wrapper.findComponent({ ref }).vm.$emit('click');
        });

        it(`emits the ${emitEventName} event with the correct value`, () => {
          expect(wrapper.emitted(emitEventName)).toEqual([expectedArgs]);
        });
      },
    );

    describe('when the TrackPlayPause component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
      });

      it('emits the playTrack event with the correct value', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[0]]);
      });
    });

    describe('when a track item is dragged', () => {
      beforeEach(async () => {
        await wrapper.find('[data-test-id="track"]').trigger('dragstart');
      });

      it('emits the dragStart event', () => {
        expect(wrapper.emitted('dragStart')).toEqual([
          [track, expect.any(DragEvent)],
        ]);
      });
    });
  });
});
