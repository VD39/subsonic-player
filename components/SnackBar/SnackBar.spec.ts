import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import IconButton from '@/components/Buttons/IconButton.vue';
import SnackBar from './SnackBar.vue';

const snacksMock = ref<Snack[]>([]);

mockNuxtImport('useSnack', () => () => ({
  snacks: snacksMock,
  removeSnack: vi.fn((id: string) => {
    snacksMock.value = snacksMock.value.filter((snack) => snack.id !== id);
  }),
}));

function factory(props = {}) {
  return mount(SnackBar, {
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

describe('SnackBar', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  describe('when snacks values are not set', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the snackbar wrapper', () => {
      expect(wrapper.find({ ref: 'snackbarWrapper' }).exists()).toBe(false);
    });
  });

  describe('when snacks values are set', () => {
    describe.each([
      [
        {
          id: 'id',
          content: 'content',
          type: 'error',
        },
      ],
      [
        {
          id: 'id',
          content: 'content',
          type: 'success',
        },
      ],
      [
        {
          id: 'id',
          content: 'content',
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

      it('shows the snackbar wrapper', () => {
        expect(wrapper.find({ ref: 'snackbarWrapper' }).exists()).toBe(true);
      });

      it('adds the correct class to content wrapper', () => {
        expect(
          wrapper.find('[data-test-id="content-wrapper"]').classes(),
        ).toContain(value.type);
      });

      it('sets the correct content', () => {
        expect(wrapper.find('[data-test-id="content"]').text()).toBe(
          value.content,
        );
      });
    });

    describe('when snacks values are more than 1', () => {
      beforeEach(() => {
        snacksMock.value = Array(4)
          .fill('')
          .map((_item, index) => ({
            id: `snack-${index}`,
            content: `content-${index}`,
            type: 'error',
          }));
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct amount of snack content', () => {
        expect(wrapper.findAll('[data-test-id="content-wrapper"]').length).toBe(
          4,
        );
      });

      describe('when remove button is clicked', () => {
        beforeEach(() => {
          wrapper.findAllComponents(IconButton)[0].vm.$emit('click');
        });

        it('shows the correct amount of snack content', () => {
          expect(
            wrapper.findAll('[data-test-id="content-wrapper"]').length,
          ).toBe(3);
        });
      });
    });
  });
});
