import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import NoMediaMessage from '@/components/notification/NoMediaMessage.vue';
import TracklistRadioItem from '@/components/tracklist/TracklistRadioItem.vue';
import { getFormattedRadioStationMock } from '@/test/helpers';

import TracklistRadio from './TracklistRadio.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

const radioStations = getFormattedRadioStationMock(5);
const radioStation = radioStations[0];

function factory(props = {}) {
  return mount(TracklistRadio, {
    props: {
      radioStations,
      ...props,
    },
  });
}

describe('TracklistRadio', () => {
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
      expect(wrapper.findAllComponents(TracklistRadioItem)).toHaveLength(5);
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
      'when the TracklistRadioItem component emits the %s event',
      (eventName, expectedArgs) => {
        beforeEach(() => {
          wrapper.findComponent(TracklistRadioItem).vm.$emit(eventName);
        });

        it(`emits the ${eventName} event with the correct value`, () => {
          expect(wrapper.emitted(eventName)).toEqual([expectedArgs]);
        });
      },
    );
  });
});
