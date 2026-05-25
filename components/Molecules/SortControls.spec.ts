import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';

import SortControls from './SortControls.vue';

mockNuxtImport('useDropdownMenu', () => () => ({
  closeDropdownMenu: vi.fn(),
  isOpen: ref(true),
  menuStyle: ref({}),
  openDropdownMenu: vi.fn(),
}));

function factory(props = {}) {
  return mount(SortControls, {
    props: {
      activeSort: 'name',
      options: [
        {
          defaultDirection: 'asc',
          key: 'name',
          label: 'Name',
        },
        {
          defaultDirection: 'asc',
          key: 'year',
          label: 'Year',
        },
      ],
      sortDirection: 'asc',
      ...props,
    },
  });
}

describe('SortControls', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct number of DropdownItem components', () => {
    expect(wrapper.findAllComponents(DropdownItem).length).toBe(2);
  });

  describe('when activeSort matches the option key', () => {
    it('sets the correct selected prop on the DropdownItem component', () => {
      expect(wrapper.findAllComponents(DropdownItem)[0].props('selected')).toBe(
        true,
      );
    });
  });

  describe('when activeSort does not match the option key', () => {
    it('does not set the selected prop on the DropdownItem component', () => {
      expect(wrapper.findAllComponents(DropdownItem)[1].props('selected')).toBe(
        false,
      );
    });
  });

  describe('when the sort direction ButtonLink component emits the click event', () => {
    beforeEach(async () => {
      wrapper
        .findComponent({ ref: 'sortDirectionButtonLink' })
        .vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('emits the toggleDirection event', () => {
      expect(wrapper.emitted('toggleDirection')).toEqual([[]]);
    });
  });

  describe.each([
    ['asc', 'desc'],
    ['desc', 'asc'],
  ])(
    'when the sortDirection value is %s',
    (activeDirection, inactiveDirection) => {
      beforeEach(() => {
        wrapper = factory({
          sortDirection: activeDirection,
        });
      });

      it('adds the sortActive class to the sort icon element', () => {
        expect(
          wrapper
            .find(`[data-test-id="sort-icon-${activeDirection}"]`)
            .classes(),
        ).toContain('sortActive');
      });

      it('does not add the sortActive class to the other sort icon element', () => {
        expect(
          wrapper
            .find(`[data-test-id="sort-icon-${inactiveDirection}"]`)
            .classes(),
        ).not.toContain('sortActive');
      });

      it('does not show the refresh icon element', () => {
        expect(
          wrapper.find('[data-test-id="sort-icon-refresh"]').exists(),
        ).toBe(false);
      });
    },
  );

  describe('when the sortDirection value is random', () => {
    beforeEach(() => {
      wrapper = factory({
        sortDirection: 'random',
      });
    });

    it('shows the refresh icon element', () => {
      expect(wrapper.find('[data-test-id="sort-icon-refresh"]').exists()).toBe(
        true,
      );
    });

    it('does not show the asc sort icon element', () => {
      expect(wrapper.find('[data-test-id="sort-icon-asc"]').exists()).toBe(
        false,
      );
    });

    it('does not show the desc sort icon element', () => {
      expect(wrapper.find('[data-test-id="sort-icon-desc"]').exists()).toBe(
        false,
      );
    });
  });

  describe('when the DropdownItem component emits the click event', () => {
    beforeEach(async () => {
      wrapper.findAllComponents(DropdownItem)[0].vm.$emit('click');
      await wrapper.vm.$nextTick();
    });

    it('emits the selectSort event', () => {
      expect(wrapper.emitted('selectSort')).toEqual([['name']]);
    });
  });
});
