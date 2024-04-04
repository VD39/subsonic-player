import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import IconButton from '@/components/Buttons/IconButton.vue';
import DropdownMenu from './DropdownMenu.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const events: any = {};

document.addEventListener = vi.fn((event, cb) => {
  events[event] = cb;
});

window.removeEventListener = vi.fn((event) => {
  events[event] = () => ({});
});

function factory(props = {}) {
  return mount(DropdownMenu, {
    props: {
      ...props,
    },
    slots: {
      default: 'Slot content',
    },
    attachTo: document.body,
  });
}

describe('DropdownMenu', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when IconButton is clicked', () => {
    beforeEach(async () => {
      wrapper.findComponent(IconButton).vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('emits the opened event', () => {
      expect(wrapper.emitted('opened')).toEqual([[]]);
    });

    it('does not emit the closed event', () => {
      expect(wrapper.emitted('closed')).toEqual(undefined);
    });

    it('shows the dropdown menu', () => {
      expect(wrapper.find({ ref: 'dropdownMenu' }).exists()).toBe(true);
    });

    describe('when IconButton is clicked again', () => {
      beforeEach(async () => {
        wrapper.findComponent(IconButton).vm.$emit('click');
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not emit the opened event again', () => {
        expect(wrapper.emitted('opened')).toEqual([[]]);
      });

      it('emits the closed event', () => {
        expect(wrapper.emitted('closed')).toEqual([[]]);
      });

      it('removes the dropdown menu', () => {
        expect(wrapper.find({ ref: 'dropdownMenu' }).exists()).toBe(false);
      });
    });

    describe('when document is clicked', () => {
      beforeEach(async () => {
        document.body.click();
        await wrapper.vm.$nextTick();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the dropdown menu', () => {
        expect(wrapper.find({ ref: 'dropdownMenu' }).exists()).toBe(false);
        expect(wrapper.find({ ref: 'dropdownMenu' }).exists()).toBe(false);
      });
    });

    describe('when dropdownMenu is clicked', () => {
      beforeEach(async () => {
        await wrapper.find({ ref: 'dropdownMenu' }).trigger('click');
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not remove the the dropdown menu', () => {
        expect(wrapper.find({ ref: 'dropdownMenu' }).exists()).toBe(true);
      });
    });

    describe('when a non esc key is pressed', () => {
      beforeEach(() => {
        events.keydown({ key: 'Shift' });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not remove the the dropdown menu', () => {
        expect(wrapper.find({ ref: 'dropdownMenu' }).exists()).toBe(true);
      });
    });

    describe('when esc key is pressed', () => {
      beforeEach(() => {
        events.keydown({ key: 'Escape' });
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('removes the dropdown menu', () => {
        expect(wrapper.find({ ref: 'dropdownMenu' }).exists()).toBe(false);
      });
    });
  });
});
