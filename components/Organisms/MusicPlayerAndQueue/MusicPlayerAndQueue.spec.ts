import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import MusicPlayer from '@/components/Organisms/MusicPlayerAndQueue/MusicPlayer/MusicPlayer.vue';
import QueueList from '@/components/Organisms/MusicPlayerAndQueue/Queue/QueueList.vue';
import QueuePlayer from '@/components/Organisms/MusicPlayerAndQueue/Queue/QueuePlayer.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';

import MusicPlayerAndQueue from './MusicPlayerAndQueue.vue';

const isQueueListOpenedMock = ref(false);
const isQueuePlayerOpenedMock = ref(false);

mockNuxtImport('useQueue', () => () => ({
  isQueueListOpened: isQueueListOpenedMock,
  isQueuePlayerOpened: isQueuePlayerOpenedMock,
}));

const { showMediaPlayerMock } = useAudioPlayerMock();

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

  describe('when showMediaPlayer value is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the MusicPlayer component', () => {
      expect(wrapper.findComponent(MusicPlayer).exists()).toBe(false);
    });
  });

  describe('when showMediaPlayer value is true', () => {
    beforeEach(() => {
      showMediaPlayerMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the MusicPlayer component', () => {
      expect(wrapper.findComponent(MusicPlayer).exists()).toBe(true);
    });
  });

  describe('when isQueuePlayerOpened is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the QueuePlayer component', () => {
      expect(wrapper.findComponent(QueuePlayer).exists()).toBe(false);
    });
  });

  describe('when isQueuePlayerOpened is true', () => {
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

  describe('when isQueueListOpened is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the QueueList component', () => {
      expect(wrapper.findComponent(QueueList).isVisible()).toBe(false);
    });
  });

  describe('when isQueueListOpened is true', () => {
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
