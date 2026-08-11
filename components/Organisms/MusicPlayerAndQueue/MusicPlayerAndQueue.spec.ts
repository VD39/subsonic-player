import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import MusicPlayer from '@/components/Organisms/MusicPlayerAndQueue/MusicPlayer/MusicPlayer.vue';
import QueueList from '@/components/Organisms/MusicPlayerAndQueue/Queue/QueueList.vue';
import QueuePlayer from '@/components/Organisms/MusicPlayerAndQueue/Queue/QueuePlayer.vue';
import { useQueueMock } from '@/test/useQueueMock';

import MusicPlayerAndQueue from './MusicPlayerAndQueue.vue';

const { hasQueueTracksMock, isQueueListOpenedMock, isQueuePlayerOpenedMock } =
  useQueueMock();

function factory(props = {}) {
  return mount(MusicPlayerAndQueue, {
    attachTo: document.body,
    global: {
      stubs: {
        MusicPlayer: true,
        QueueList: true,
        QueuePlayer: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('MusicPlayerAndQueue', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when the showMediaPlayer value is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the MusicPlayer component', () => {
      expect(wrapper.findComponent(MusicPlayer).exists()).toBe(false);
    });
  });

  describe('when the showMediaPlayer value is true', () => {
    beforeEach(() => {
      hasQueueTracksMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the MusicPlayer component', () => {
      expect(wrapper.findComponent(MusicPlayer).exists()).toBe(true);
    });
  });

  describe('when the isQueuePlayerOpened value is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the QueuePlayer component', () => {
      expect(wrapper.findComponent(QueuePlayer).exists()).toBe(false);
    });
  });

  describe('when the isQueuePlayerOpened value is true', () => {
    beforeEach(() => {
      isQueuePlayerOpenedMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the QueuePlayer component', () => {
      expect(wrapper.findComponent(QueuePlayer).exists()).toBe(true);
    });
  });

  describe('when the isQueueListOpened value is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the QueueList component', () => {
      expect(wrapper.findComponent(QueueList).isVisible()).toBe(false);
    });
  });

  describe('when the isQueueListOpened value is true', () => {
    beforeEach(() => {
      isQueueListOpenedMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the QueueList component', () => {
      expect(wrapper.findComponent(QueueList).isVisible()).toBe(true);
    });
  });
});
