import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import MediaInformation from './MediaInformation.vue';

const openTrackInformationModalMock = vi.fn();

mockNuxtImport('useDescription', () => () => ({
  openTrackInformationModal: openTrackInformationModalMock,
}));

const { currentTrackMock } = useAudioPlayerMock();

function factory(props = {}) {
  return mount(MediaInformation, {
    props: {
      ...props,
    },
  });
}

describe('MediaInformation', () => {
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

    it('calls the openModal function with correct parameters', () => {
      expect(openTrackInformationModalMock).toHaveBeenCalledWith(
        currentTrackMock.value,
      );
    });
  });
});
