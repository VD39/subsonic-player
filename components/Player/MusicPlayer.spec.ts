import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import MusicPlayer from './MusicPlayer.vue';

useAudioPlayerMock();

function factory(props = {}) {
  return mount(MusicPlayer, {
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

describe('MusicPlayer', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
