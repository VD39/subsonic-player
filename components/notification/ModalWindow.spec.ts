import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/ui/ButtonLink.vue';

import ModalWindow from './ModalWindow.vue';

const modalMock = ref({});

mockNuxtImport('useModal', (original) => () => ({
  ...original(),
  closeModal: vi.fn(() => (modalMock.value = {})),
  modal: modalMock,
}));

function factory(props = {}) {
  return mount(ModalWindow, {
    attachTo: document.body,
    props: {
      ...props,
    },
  });
}

describe('ModalWindow', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when modal values are not set', () => {
    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('does not show the modal container element', () => {
      expect(wrapper.find({ ref: 'modalContainer' }).exists()).toBe(false);
    });
  });

  describe('when modal values are set', () => {
    beforeEach(() => {
      modalMock.value = {
        component: 'div',
      };
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('shows the modal container element', () => {
      expect(wrapper.find({ ref: 'modalContainer' }).exists()).toBe(true);
    });

    it('shows the correct component', () => {
      expect(
        (wrapper.find({ ref: 'component' }).element as HTMLElement).tagName,
      ).toBe('DIV');
    });

    describe('when title is not set', () => {
      it('does not show the title element', () => {
        expect(wrapper.find({ ref: 'title' }).exists()).toBe(false);
      });
    });

    describe('when title is set', () => {
      beforeEach(() => {
        modalMock.value = {
          component: 'div',
          title: 'Title',
        };
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the title element', () => {
        expect(wrapper.find({ ref: 'title' }).exists()).toBe(true);
      });
    });

    describe('when modal content is clicked', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'modalContent' }).trigger('click');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not remove the component', () => {
        expect(wrapper.find({ ref: 'modalContainer' }).exists()).toBe(true);
      });
    });

    describe('when modal container is clicked', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'modalContainer' }).trigger('click');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the component', () => {
        expect(wrapper.find({ ref: 'modalContainer' }).exists()).toBe(false);
      });
    });

    describe('when the ButtonLink component is clicked', () => {
      beforeEach(async () => {
        await wrapper.findComponent(ButtonLink).trigger('click');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the component', () => {
        expect(wrapper.find({ ref: 'modalContainer' }).exists()).toBe(false);
      });
    });
  });

  describe('when the modal component contains an input', () => {
    beforeEach(async () => {
      modalMock.value = {
        component: markRaw({
          template: `
            <div>
              <input
                class="${INTERACTION_INPUT_CLASS}"
                data-test-id="first-input"
              />
              <input
                class="${INTERACTION_INPUT_CLASS}"
                data-test-id="second-input"
              />
            </div>
          `,
        }),
      };

      await nextTick();
    });

    it('focuses the first input element', () => {
      expect(document.activeElement).toBe(
        wrapper.find('[data-test-id="first-input"]').element,
      );
    });

    describe('when the first input is disabled', () => {
      beforeEach(async () => {
        modalMock.value = {
          component: markRaw({
            template: `
              <div>
                <input
                  class="${INTERACTION_INPUT_CLASS}"
                  data-test-id="first-input"
                  disabled
                />
                <input
                  class="${INTERACTION_INPUT_CLASS}"
                  data-test-id="second-input"
                />
              </div>
            `,
          }),
        };

        await nextTick();
      });

      it('focuses the next enabled input element', () => {
        expect(document.activeElement).toBe(
          wrapper.find('[data-test-id="second-input"]').element,
        );
      });
    });
  });

  describe('when the modal component does not contain an input', () => {
    beforeEach(async () => {
      modalMock.value = {
        component: markRaw({
          template: '<div>No input here.</div>',
        }),
      };

      await nextTick();
    });

    it('does not focus an input element', () => {
      expect(document.activeElement).not.toBeInstanceOf(HTMLInputElement);
    });
  });
});
