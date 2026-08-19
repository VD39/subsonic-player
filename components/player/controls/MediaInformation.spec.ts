import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/ui/ButtonLink.vue';
import { useQueueMock } from '@/test/useQueueMock';

import MediaInformation from './MediaInformation.vue';

const openTrackDetailsModalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useMediaInformation', (original) => () => ({
  ...original(),
  openTrackDetailsModal: openTrackDetailsModalMock,
}));

const { currentTrackMock } = useQueueMock();

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
    beforeEach(async () => {
      await wrapper.findComponent(ButtonLink).trigger('click');
    });

    it('calls the openModal function with the correct parameters', () => {
      expect(openTrackDetailsModalMock).toHaveBeenCalledWith(
        currentTrackMock.value,
      );
    });
  });
});
