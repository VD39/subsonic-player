import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';
import { getFormattedRadioStationMock } from '@/test/helpers';

import RadioStationsList from './RadioStationsList.vue';

const radioStations = getFormattedRadioStationMock(5);

function factory(props = {}) {
  const wrapper = mount(RadioStationsList, {
    props: {
      radioStations: [],
      ...props,
    },
  });

  const dropdownMenu = wrapper.findComponent(DropdownMenu);

  if (dropdownMenu.exists()) {
    dropdownMenu.findComponent(ButtonLink).vm.$emit('click');
  }

  return wrapper;
}

describe('RadioStationsList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when radioStations prop is an empty array', () => {
    it('does not show the radio station wrapper element', () => {
      expect(wrapper.find({ ref: 'radioStationWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when radioStations prop is not an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        radioStations,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the radio station wrapper element', () => {
      expect(wrapper.find({ ref: 'radioStationWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of radio station items', () => {
      expect(wrapper.findAll('[data-test-id="radio-station"]').length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe.each([
      [
        'delete radio station DropdownItem',
        'deleteRadioStation',
        'deleteRadioStation',
        [radioStations[0].id],
      ],
      [
        'edit radio station DropdownItem',
        'editRadioStation',
        'editRadioStation',
        [radioStations[0]],
      ],
      [
        'add to queue DropdownItem',
        'addToQueue',
        'addToQueue',
        [radioStations[0]],
      ],
      [
        'play radio station DropdownItem',
        'playRadioStation',
        'playRadioStation',
        [radioStations[0]],
      ],
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

      it('emits the playRadioStation event with the correct value', () => {
        expect(wrapper.emitted('playRadioStation')).toEqual([
          [radioStations[0]],
        ]);
      });
    });
  });
});
