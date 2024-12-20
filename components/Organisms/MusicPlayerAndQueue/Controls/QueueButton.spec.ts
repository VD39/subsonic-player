import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import QueueButton from './QueueButton.vue';

const toggleQueuePlayerMock = vi.fn();

mockNuxtImport('useQueue', () => () => ({
  toggleQueuePlayer: toggleQueuePlayerMock,
}));

function factory(props = {}) {
  return mount(QueueButton, {
    props: {
      ...props,
    },
  });
}

describe('QueueButton', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the ButtonLink component is clicked', () => {
    beforeEach(() => {
      wrapper.findComponent(ButtonLink).vm.$emit('click');
    });

    it('calls the toggleQueuePlayer function', () => {
      expect(toggleQueuePlayerMock).toHaveBeenCalled();
    });
  });
});
