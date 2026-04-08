import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import { getFormattedTracksMock } from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import TrackPlayPauseDropdownItem from './TrackPlayPauseDropdownItem.vue';

const { isCurrentTrackMock, isPlayingMock, togglePlayMock } =
  useAudioPlayerMock();

const track = getFormattedTracksMock()[0];

function factory(props = {}) {
  return mount(TrackPlayPauseDropdownItem, {
    props: {
      trackId: track.id,
      type: track.type,
      ...props,
    },
  });
}

describe('TrackPlayPauseDropdownItem', () => {
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

  describe('when the isCurrentTrack value returns false', () => {
    it('shows the Play text', () => {
      expect(wrapper.text()).toContain('Play');
    });
  });

  describe('when the isCurrentTrack value returns true', () => {
    describe.each([
      [true, 'Pause'],
      [false, 'Play'],
    ])('when the isPlaying value is %s', (isPlaying, text) => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(true);
        isPlayingMock.value = isPlaying;
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it(`shows the ${text} text`, () => {
        expect(wrapper.text()).toContain(text);
      });
    });
  });

  describe.each([
    [MEDIA_TYPE.podcastEpisode, 'Episode'],
    [MEDIA_TYPE.radioStation, 'Station'],
    [MEDIA_TYPE.track, 'Track'],
  ])('when the type prop is %s', (type, text) => {
    beforeEach(() => {
      wrapper = factory({
        type,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it(`shows the ${text} text`, () => {
      expect(wrapper.text()).toContain(text);
    });
  });

  describe('when the DropdownItem component emits the click event', () => {
    describe('when the current track is playing', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(true);
        isPlayingMock.value = true;

        wrapper.findComponent(DropdownItem).vm.$emit('click');
      });

      it('calls the togglePlay function', () => {
        expect(togglePlayMock).toHaveBeenCalled();
      });

      it('does not emit the playTrack event', () => {
        expect(wrapper.emitted('playTrack')).toBeUndefined();
      });
    });

    describe('when the current track is not playing', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(false);
        isPlayingMock.value = false;

        wrapper.findComponent(DropdownItem).vm.$emit('click');
      });

      it('emits the playTrack event', () => {
        expect(wrapper.emitted('playTrack')).toEqual([[]]);
      });

      it('does not call the togglePlay function', () => {
        expect(togglePlayMock).not.toHaveBeenCalled();
      });
    });
  });
});
