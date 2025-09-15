import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedTracksMock } from '@/test/helpers';

import AlbumTracksList from './AlbumTracksList.vue';

const tracks = getFormattedTracksMock(5);
const track = tracks[0];

async function factory(props = {}) {
  const wrapper = mount(AlbumTracksList, {
    props: {
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

describe('AlbumTracksList', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when tracks prop is an empty array', () => {
    it('does not show the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when tracks prop is not an empty array', () => {
    beforeEach(async () => {
      wrapper = await factory({
        tracks,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of track items', () => {
      expect(wrapper.findAll('[data-test-id="track"]').length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when track.artists is an empty array', () => {
      beforeEach(async () => {
        wrapper = await factory({
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
    });

    describe('when track.artists is not empty array', () => {
      it('shows the MarqueeScroll component containing the artists details', () => {
        expect(
          wrapper.findComponent({ ref: 'artistsMarqueeScroll' }).exists(),
        ).toBe(true);
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
