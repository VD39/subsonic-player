import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InputField from '@/components/Atoms/InputField.vue';
import { getFormattedPlaylistsMock } from '@/test/helpers';
import { mount } from '@vue/test-utils';

import AddToPlaylistForm from './AddToPlaylistForm.vue';

const playlists = getFormattedPlaylistsMock(5);

function factory(props = {}) {
  return mount(AddToPlaylistForm, {
    props: {
      loading: false,
      playlists: [],
      trackId: 'trackId',
      ...props,
    },
  });
}

const buttonProps = {
  false: {
    icon: ICONS.add,
    text: 'Add',
  },
  true: {
    icon: ICONS.remove,
    text: 'Remove',
  },
};

describe('AddToPlaylistForm', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  describe('when playlists prop is an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the playlists wrapper element', () => {
      expect(wrapper.find({ ref: 'playlistsWrapper' }).exists()).toBe(false);
    });
  });

  describe('when playlists prop is not an empty array', () => {
    beforeAll(() => {
      wrapper = factory({
        playlists,
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the playlists wrapper element', () => {
      expect(wrapper.find({ ref: 'playlistsWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of playlist items', () => {
      expect(wrapper.findAll('[data-test-id="playlist"]').length).toBe(5);
    });

    it('sets the correct icon prop on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
        buttonProps.false.icon,
      );
    });

    it('sets the correct title attribute on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
        buttonProps.false.text,
      );
    });

    it('sets the correct slot data on the ButtonLink component', () => {
      expect(wrapper.findComponent(ButtonLink).text()).toContain(
        buttonProps.false.text,
      );
    });

    describe('when the ButtonLink component is clicked', () => {
      beforeAll(() => {
        wrapper.findComponent(ButtonLink).vm.$emit('click');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('emits addToPlaylist event with form values', () => {
        expect(wrapper.emitted('addToPlaylist')).toEqual([
          [
            {
              playlistId: 'playlist-0',
            },
          ],
        ]);
      });

      it('updates the icon prop on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
          buttonProps.true.icon,
        );
      });

      it('updates the title attribute on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
          buttonProps.true.text,
        );
      });

      it('updates the slot data on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).text()).toContain(
          buttonProps.true.text,
        );
      });

      describe('when the ButtonLink component is clicked again', () => {
        beforeAll(() => {
          wrapper.findComponent(ButtonLink).vm.$emit('click');
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('emits removeFromPlaylist event with form values', () => {
          expect(wrapper.emitted('removeFromPlaylist')).toEqual([
            [
              {
                playlistId: 'playlist-0',
              },
            ],
          ]);
        });

        it('updates the icon prop on the ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
            buttonProps.false.icon,
          );
        });

        it('updates the title attribute on the ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
            buttonProps.false.text,
          );
        });

        it('updates slot data on the ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).text()).toContain(
            buttonProps.false.text,
          );
        });
      });
    });
  });

  describe('when form is invalid', () => {
    beforeAll(async () => {
      await wrapper.find({ ref: 'formWrapper' }).trigger('submit');
    });

    it('does not emit submit event', () => {
      expect(wrapper.emitted('submit')).toBe(undefined);
    });
  });

  describe('when form is valid', () => {
    beforeAll(async () => {
      wrapper
        .findComponent(InputField)
        .vm.$emit('update:modelValue', 'Playlist');
      await wrapper.find({ ref: 'formWrapper' }).trigger('submit');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('emits submit event with form values', () => {
      expect(wrapper.emitted('submit')).toEqual([['Playlist']]);
    });
  });
});
