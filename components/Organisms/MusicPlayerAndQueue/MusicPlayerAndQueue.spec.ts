import type { VueWrapper } from '@vue/test-utils';

import MusicPlayer from '@/components/Organisms/MusicPlayerAndQueue/MusicPlayer/MusicPlayer.vue';
import QueueList from '@/components/Organisms/MusicPlayerAndQueue/Queue/QueueList.vue';
import QueuePlayer from '@/components/Organisms/MusicPlayerAndQueue/Queue/QueuePlayer.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import MusicPlayerAndQueue from './MusicPlayerAndQueue.vue';

const queueListOpenedMock = ref(false);
const queuePlayerOpenedMock = ref(false);

mockNuxtImport('useQueue', () => () => ({
  queueListOpened: queueListOpenedMock,
  queuePlayerOpened: queuePlayerOpenedMock,
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

  describe('when queuePlayerOpened is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the QueuePlayer component', () => {
      expect(wrapper.findComponent(QueuePlayer).exists()).toBe(false);
    });
  });

  describe('when queuePlayerOpened is true', () => {
    beforeEach(() => {
      queuePlayerOpenedMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the QueuePlayer component', () => {
      expect(wrapper.findComponent(QueuePlayer).exists()).toBe(true);
    });
  });

  describe('when queueListOpened is false', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the QueueList component', () => {
      expect(wrapper.findComponent(QueueList).exists()).toBe(false);
    });
  });

  describe('when queueListOpened is true', () => {
    beforeEach(() => {
      queueListOpenedMock.value = true;
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the QueueList component', () => {
      expect(wrapper.findComponent(QueueList).exists()).toBe(true);
    });
  });
});
