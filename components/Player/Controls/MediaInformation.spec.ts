import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import IconButton from '@/components/Buttons/IconButton.vue';
import MediaInformation from './MediaInformation.vue';

const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  openModal: openModalMock,
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

  describe.each([
    [
      'track',
      'trackDetailsModal',
      {
        track: currentTrackMock.value,
      },
    ],
    [
      'podcast',
      'podcastDescriptionModal',
      {
        description: currentTrackMock.value.description,
      },
    ],
  ])('when currentTrack type is %s', (type, name, value) => {
    beforeEach(() => {
      currentTrackMock.value = {
        ...currentTrackMock.value,
        type: type as MediaType,
      };
    });

    describe('when the media information button is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent(IconButton).vm.$emit('click');
      });

      it('calls the openModal function with correct parameters', () => {
        expect(openModalMock).toHaveBeenCalledWith(name, value);
      });
    });
  });
});
