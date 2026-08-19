import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import ButtonLink from '@/components/ui/ButtonLink.vue';
import InputField from '@/components/ui/InputField.vue';
import { getFormattedPlaylistsMock } from '@/test/helpers';

import AddToPlaylistForm from './AddToPlaylistForm.vue';

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(),
  getImageUrl: vi.fn((path) => path),
}));

mockNuxtImport('useAuth', (original) => () => ({
  ...original(),
  autoLogin: vi.fn(),
  isAuthenticated: ref(true),
}));

const playlists = getFormattedPlaylistsMock(5);

async function factory(props = {}, route = '/') {
  return mountSuspended(AddToPlaylistForm, {
    props: {
      loading: false,
      newlyCreatedPlaylistId: 'newlyCreatedPlaylistId',
      playlists,
      ...props,
    },
    route,
  });
}

const buttonProps = {
  add: {
    icon: ICONS.add,
    text: 'Add',
  },
  remove: {
    icon: ICONS.remove,
    text: 'Remove',
  },
};

describe('AddToPlaylistForm', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await factory();
  });

  describe('when the playlists prop is an empty array', () => {
    beforeEach(async () => {
      wrapper = await factory({
        playlists: [],
      });
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the playlists wrapper element', () => {
      expect(wrapper.find({ ref: 'playlistsWrapper' }).exists()).toBe(false);
    });
  });

  describe('when the playlists prop is not an empty array', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the playlists wrapper element', () => {
      expect(wrapper.find({ ref: 'playlistsWrapper' }).exists()).toBe(true);
    });

    it('shows the correct number of playlist items', () => {
      expect(wrapper.findAll('[data-test-id="playlist"]')).toHaveLength(5);
    });

    describe('when playlist id is not random', () => {
      it('shows the ButtonLink component', () => {
        expect(
          wrapper
            .find('[data-test-id="playlist"]')
            .findComponent(ButtonLink)
            .exists(),
        ).toBe(true);
      });

      it('sets the correct icon prop on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
          buttonProps.add.icon,
        );
      });

      it('sets the correct title attribute on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
          buttonProps.add.text,
        );
      });

      it('sets the correct slot data on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).text()).toContain(
          buttonProps.add.text,
        );
      });

      describe('when the ButtonLink component is clicked', () => {
        beforeEach(async () => {
          await wrapper.findComponent(ButtonLink).trigger('click');
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it('emits addToPlaylist event with the form values', () => {
          expect(wrapper.emitted('addToPlaylist')).toEqual([['playlist-0']]);
        });

        it('updates the icon prop on the ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
            buttonProps.remove.icon,
          );
        });

        it('updates the title attribute on the ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
            buttonProps.remove.text,
          );
        });

        it('updates the slot data on the ButtonLink component', () => {
          expect(wrapper.findComponent(ButtonLink).text()).toContain(
            buttonProps.remove.text,
          );
        });

        describe('when the ButtonLink component is clicked again', () => {
          beforeEach(async () => {
            await wrapper.findComponent(ButtonLink).trigger('click');
          });

          it('matches the snapshot', () => {
            expect(wrapper.html()).toMatchSnapshot();
          });

          it('emits removeFromPlaylist event with the form values', () => {
            expect(wrapper.emitted('removeFromPlaylist')).toEqual([
              ['playlist-0'],
            ]);
          });

          it('updates the icon prop on the ButtonLink component', () => {
            expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
              buttonProps.add.icon,
            );
          });

          it('updates the title attribute on the ButtonLink component', () => {
            expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
              buttonProps.add.text,
            );
          });

          it('updates the slot data on the ButtonLink component', () => {
            expect(wrapper.findComponent(ButtonLink).text()).toContain(
              buttonProps.add.text,
            );
          });
        });
      });
    });

    describe('when playlist id is random', () => {
      beforeEach(async () => {
        wrapper = await factory({
          playlists: [
            {
              ...getFormattedPlaylistsMock()[0],
              id: 'random',
            },
          ],
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the ButtonLink component', () => {
        expect(
          wrapper
            .find('[data-test-id="playlist"]')
            .findComponent(ButtonLink)
            .exists(),
        ).toBe(false);
      });
    });

    describe('when the newlyCreatedPlaylistId prop is the same as the playlist id', () => {
      beforeEach(async () => {
        wrapper = await factory({
          newlyCreatedPlaylistId: playlists[0].id,
        });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct icon prop on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
          buttonProps.remove.icon,
        );
      });

      it('sets the correct title attribute on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
          buttonProps.remove.text,
        );
      });

      it('sets the correct slot data on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).text()).toContain(
          buttonProps.remove.text,
        );
      });
    });

    describe('when router params has an id that matches the playlist id', () => {
      beforeEach(async () => {
        wrapper = await factory({}, `/playlist/${playlists[0].id}`);
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('sets the correct icon prop on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).props('icon')).toBe(
          buttonProps.remove.icon,
        );
      });

      it('sets the correct title attribute on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).attributes('title')).toBe(
          buttonProps.remove.text,
        );
      });

      it('sets the correct slot data on the ButtonLink component', () => {
        expect(wrapper.findComponent(ButtonLink).text()).toContain(
          buttonProps.remove.text,
        );
      });
    });
  });

  describe('when form is invalid', () => {
    beforeEach(async () => {
      await wrapper.find({ ref: 'formWrapper' }).trigger('submit');
    });

    it('does not emit submit event', () => {
      expect(wrapper.emitted('submit')).toBeUndefined();
    });
  });

  describe('when form is valid', () => {
    beforeEach(async () => {
      wrapper
        .findComponent(InputField)
        .vm.$emit('update:modelValue', 'Playlist');
      await wrapper.find({ ref: 'formWrapper' }).trigger('submit');
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('emits submit event with the form values', () => {
      expect(wrapper.emitted('submit')).toEqual([['Playlist']]);
    });
  });
});
