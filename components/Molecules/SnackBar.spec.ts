import type { VueWrapper } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import MessageBar from '@/components/Atoms/MessageBar.vue';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import SnackBar from './SnackBar.vue';

const snacksMock = ref<Snack[]>([]);

mockNuxtImport('useSnack', () => () => ({
  removeSnack: vi.fn((id: string) => {
    snacksMock.value = snacksMock.value.filter((snack) => snack.id !== id);
  }),
  snacks: snacksMock,
}));

function factory(props = {}) {
  return mount(SnackBar, {
    props: {
      ...props,
    },
  });
}

describe('SnackBar', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when snacks values are not set', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the snackbar wrapper element', () => {
      expect(wrapper.find({ ref: 'snackbarWrapper' }).exists()).toBe(false);
    });
  });

  describe('when snacks values are set', () => {
    describe.each([
      [
        {
          content: 'content',
          id: 'id',
          type: 'error',
        },
      ],
      [
        {
          content: 'content',
          id: 'id',
          type: 'success',
        },
      ],
      [
        {
          content: 'content',
          id: 'id',
          type: 'info',
        },
      ],
    ])('when value is %o', (value) => {
      beforeEach(() => {
        snacksMock.value = [value as Snack];
      });

      afterEach(() => {
        snacksMock.value = [];
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the snackbar wrapper element', () => {
        expect(wrapper.find({ ref: 'snackbarWrapper' }).exists()).toBe(true);
      });

      it('adds the correct class to content wrapper element', () => {
        expect(wrapper.findComponent(MessageBar).classes()).toContain(
          value.type,
        );
      });

      it('sets the correct content', () => {
        expect(wrapper.find({ ref: 'content' }).text()).toBe(value.content);
      });
    });

    describe('when snacks values are more than 1', () => {
      beforeEach(() => {
        snacksMock.value = Array(4)
          .fill('')
          .map((_item, index) => ({
            content: `content-${index}`,
            id: `snack-${index}`,
            type: 'error',
          }));
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct number of snack content', () => {
        expect(wrapper.findAllComponents(MessageBar).length).toBe(4);
      });

      describe('when the ButtonLink component emits a click event', () => {
        beforeEach(() => {
          wrapper.findAllComponents(ButtonLink)[0].vm.$emit('click');
        });

        it('shows the correct number of snack content', () => {
          expect(wrapper.findAllComponents(MessageBar).length).toBe(3);
        });
      });
    });
  });
});
