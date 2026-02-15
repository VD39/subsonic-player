import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import RadioStationsListItem from '@/components/Organisms/TrackLists/RadioStationsListItem.vue';
import { getFormattedRadioStationMock } from '@/test/helpers';

import RadioStationsList from './RadioStationsList.vue';

const radioStations = getFormattedRadioStationMock(5);
const radioStation = radioStations[0];

function factory(props = {}) {
  return mount(RadioStationsList, {
    props: {
      radioStations,
      ...props,
    },
  });
}

describe('RadioStationsList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the radioStations prop is an empty array', () => {
    beforeEach(() => {
      wrapper = factory({
        radioStations: [],
      });
    });

    it('does not show the radio station wrapper element', () => {
      expect(wrapper.find({ ref: 'radioStationWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when the radioStations prop is not an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the radio station wrapper element', () => {
      expect(wrapper.find({ ref: 'radioStationWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of radio station items', () => {
      expect(wrapper.findAllComponents(RadioStationsListItem).length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe.each([
      ['addToQueue', [radioStation]],
      ['deleteRadioStation', [radioStation.id]],
      ['editRadioStation', [radioStation]],
      ['playRadioStation', [radioStation]],
    ])(
      'when the RadioStationsListItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(async () => {
          wrapper.findComponent(RadioStationsListItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );
  });
});
