import type { VueWrapper } from '@vue/test-utils';

import ArtistsList from '@/components/Atoms/ArtistsList.vue';
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedTracksMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

import TrackListWithPreview from './TrackListWithPreview.vue';

const tracks = getFormattedTracksMock(5);

function factory(props = {}) {
  const wrapper = mount(TrackListWithPreview, {
    props: {
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

describe('TrackListWithPreview', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when radioStations prop is an empty array', () => {
    it('does not show the tracks wrapper element', () => {
      expect(wrapper.find({ ref: 'tracksWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when radioStations prop is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
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

    it('does not show the NoMediaArtistsListMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when track.artists is an empty array', () => {
      beforeEach(() => {
        wrapper = factory({
          tracks: getFormattedTracksMock(5, {
            artists: [],
          }),
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
      });
    });

    describe('when track.artists is not empty array', () => {
      it('shows the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(true);
      });
    });

    describe('when the media information DropdownItem component emits the click event', () => {
      beforeEach(() => {
        wrapper.findComponent({ ref: 'mediaInformation' }).vm.$emit('click');
      });

      it('emits the mediaInformation event with track', () => {
        expect(wrapper.emitted('mediaInformation')).toEqual([[tracks[0]]]);
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

    describe('when the TrackPlayPause component emits the playTrack event', () => {
      beforeEach(() => {
        wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
      });

      it('emits the playTrack event with track', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[0]]);
      });
    });

    describe('when inPlaylist prop is false', () => {
      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the remove from playlist DropdownItem component', () => {
        expect(
          wrapper.findComponent({ ref: 'removeFromPlaylist' }).exists(),
        ).toBe(false);
      });

      it('shows the add to playlist DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'addToPlaylist' }).exists()).toBe(
          true,
        );
      });

      describe('when the add to playlist DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper.findComponent({ ref: 'addToPlaylist' }).vm.$emit('click');
        });

        it('emits the addToPlaylist event with track', () => {
          expect(wrapper.emitted('addToPlaylist')).toEqual([[tracks[0]]]);
        });
      });
    });

    describe('when inPlaylist prop is true', () => {
      beforeEach(() => {
        wrapper = factory({
          inPlaylist: true,
          tracks,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the remove from playlist DropdownItem component', () => {
        expect(
          wrapper.findComponent({ ref: 'removeFromPlaylist' }).exists(),
        ).toBe(true);
      });

      it('does not show the add to playlist DropdownItem component', () => {
        expect(wrapper.findComponent({ ref: 'addToPlaylist' }).exists()).toBe(
          false,
        );
      });

      describe('when the remove from playlist DropdownItem component emits the click event', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ ref: 'removeFromPlaylist' })
            .vm.$emit('click');
        });

        it('emits the removeFromPlaylist event with track', () => {
          expect(wrapper.emitted('removeFromPlaylist')).toEqual([[tracks[0]]]);
        });
      });
    });
  });
});
