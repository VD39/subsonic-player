import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import ButtonLink from '@/components/Atoms/ButtonLink.vue';

import ModalWindow from './ModalWindow.vue';

const modalMock = ref({});

mockNuxtImport('useModal', () => () => ({
  closeModal: vi.fn(() => (modalMock.value = {})),
  modal: modalMock,
}));

function factory(props = {}) {
  return mount(ModalWindow, {
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
        wrapper.findComponent(ButtonLink).vm.$emit('click');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the component', () => {
        expect(wrapper.find({ ref: 'modalContainer' }).exists()).toBe(false);
      });
    });
  });
});
