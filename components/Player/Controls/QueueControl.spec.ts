import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import IconButton from '@/components/Buttons/IconButton.vue';
import QueueMenu from '@/components/Queue/QueueMenu.vue';
import QueueControl from './QueueControl.vue';

useAudioPlayerMock();

function factory(props = {}) {
  return mount(QueueControl, {
    props: {
      ...props,
    },
    global: {
      stubs: {
        teleport: true,
      },
    },
  });
}

describe('QueueControl', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('does not show the QueueMenu component', () => {
    expect(wrapper.findComponent(QueueMenu).exists()).toBe(false);
  });

  describe('when the IconButton component is clicked', () => {
    beforeEach(async () => {
      wrapper.findComponent(IconButton).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the QueueMenu component', () => {
      expect(wrapper.findComponent(QueueMenu).exists()).toBe(true);
    });

    describe('when the QueueMenu component emits the close event', () => {
      beforeEach(async () => {
        wrapper.findComponent(QueueMenu).vm.$emit('close');
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the QueueMenu component', () => {
        expect(wrapper.findComponent(QueueMenu).exists()).toBe(false);
      });
    });
  });
});
