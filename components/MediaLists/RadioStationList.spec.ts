import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { getFormattedRadioStationMock } from '@/test/helpers';
import IconButton from '@/components/Buttons/IconButton.vue';
import NoMediaMessage from '@/components/NoMediaMessage/NoMediaMessage.vue';
import RadioStationList from './RadioStationList.vue';

function factory(props = {}) {
  return mount(RadioStationList, {
    props: {
      radioStations: [],
      ...props,
    },
  });
}

describe('RadioStationList', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when radioStations prop is an empty array', () => {
    it('does not show the radio station wrapper', () => {
      expect(wrapper.find({ ref: 'radioStationWrapper' }).exists()).toBe(false);
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });
  });

  describe('when radioStations prop is not an empty array', () => {
    const radioStations = getFormattedRadioStationMock(5);

    beforeAll(async () => {
      wrapper = factory({
        radioStations,
      });

      wrapper
        .findAllComponents('[data-test-id="dropdown-menu"]')[0]
        .findComponent(IconButton)
        .vm.$emit('click');

      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the radio station wrapper', () => {
      expect(wrapper.find({ ref: 'radioStationWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of radio station items', () => {
      expect(wrapper.findAll('[data-test-id="radio-station"]').length).toBe(5);
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    describe('when the delete radio station button is clicked', () => {
      beforeAll(() => {
        (
          wrapper.findAllComponents(
            '[data-test-id="delete-radio-station"]',
          )[0] as VueWrapper
        ).vm.$emit('click');
      });

      it('emits the deleteRadioStation event with track', () => {
        expect(wrapper.emitted('deleteRadioStation')).toEqual([
          [radioStations[0]],
        ]);
      });
    });

    describe('when the edit radio station button is clicked', () => {
      beforeAll(() => {
        (
          wrapper.findAllComponents(
            '[data-test-id="edit-radio-station"]',
          )[0] as VueWrapper
        ).vm.$emit('click');
      });

      it('emits the editRadioStation event with track', () => {
        expect(wrapper.emitted('editRadioStation')).toEqual([
          [radioStations[0]],
        ]);
      });
    });

    describe('when the add to queue button is clicked', () => {
      beforeAll(() => {
        (
          wrapper.findAllComponents(
            '[data-test-id="add-to-queue"]',
          )[0] as VueWrapper
        ).vm.$emit('click');
      });

      it('emits the addToQueue event with track', () => {
        expect(wrapper.emitted('addToQueue')).toEqual([[radioStations[0]]]);
      });
    });

    describe('when the play station button is clicked', () => {
      beforeAll(() => {
        (
          wrapper.findAllComponents(
            '[data-test-id="play-station"]',
          )[0] as VueWrapper
        ).vm.$emit('click');
      });

      it('emits the playStation event with track', () => {
        expect(wrapper.emitted('playStation')).toEqual([[radioStations[0]]]);
      });
    });
  });
});
