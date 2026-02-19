import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedRadioStationMock } from '@/test/helpers';

import RadioStationsListItem from './RadioStationsListItem.vue';

const isCurrentTrackMock = vi.fn().mockReturnValue(false);

mockNuxtImport('useAudioPlayer', () => () => ({
  isCurrentTrack: isCurrentTrackMock,
}));

const radioStation = getFormattedRadioStationMock()[0];

const openDropdownMenuMock = vi.fn();

function factory(props = {}) {
  return mount(RadioStationsListItem, {
    global: {
      stubs: {
        DropdownMenu: {
          methods: {
            openDropdownMenu: openDropdownMenuMock,
          },
          template: '<div><slot /></div>',
        },
        TrackPlayPause: true,
      },
    },
    props: {
      index: 0,
      radioStation,
      ...props,
    },
  });
}

describe('RadioStationsListItem', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when radioStation.homePageUrl is defined', () => {
    it('shows the visit station DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'visitStation' }).exists()).toBe(
        true,
      );
    });
  });

  describe('when radioStation.homePageUrl is undefined', () => {
    beforeEach(() => {
      wrapper = factory({
        radioStation: getFormattedRadioStationMock(1, {
          homePageUrl: undefined,
        })[0],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the visit station DropdownItem component', () => {
      expect(wrapper.findComponent({ ref: 'visitStation' }).exists()).toBe(
        false,
      );
    });
  });

  describe.each([
    ['play radio station DropdownItem', 'playRadioStation', 'playRadioStation'],
    ['add to queue DropdownItem', 'addToQueue', 'addToQueue'],
    ['edit radio station DropdownItem', 'editRadioStation', 'editRadioStation'],
    [
      'delete radio station DropdownItem',
      'deleteRadioStation',
      'deleteRadioStation',
    ],
  ])(
    'when the %s component emits the click event',
    (_text, ref, emitEventName) => {
      beforeEach(() => {
        wrapper.findComponent({ ref }).vm.$emit('click');
      });

      it(`emits the ${emitEventName} event`, () => {
        expect(wrapper.emitted(emitEventName)).toEqual([[]]);
      });
    },
  );

  describe('when the TrackPlayPause component emits the playTrack event', () => {
    beforeEach(async () => {
      wrapper.findComponent(TrackPlayPause).vm.$emit('playTrack');
    });

    it('emits the playRadioStation event', () => {
      expect(wrapper.emitted('playRadioStation')).toEqual([[]]);
    });
  });

  describe('when the InteractionWrapper component emits the click event', () => {
    describe('when isCurrentTrack is true', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(true);
        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('does not emit the playRadioStation event', () => {
        expect(wrapper.emitted('playRadioStation')).toBeUndefined();
      });
    });

    describe('when isCurrentTrack is false', () => {
      beforeEach(() => {
        isCurrentTrackMock.mockReturnValue(false);

        wrapper.findComponent(InteractionWrapper).vm.$emit('click');
      });

      it('emits the playRadioStation event', () => {
        expect(wrapper.emitted('playRadioStation')).toEqual([[]]);
      });
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
