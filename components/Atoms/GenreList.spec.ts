import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import GenreList from './GenreList.vue';

function factory(props = {}) {
  return mount(GenreList, {
    props: {
      genres: [
        {
          name: 'name',
        },
        {
          name: 'name1',
        },
      ],
      ...props,
    },
  });
}

describe('GenreList', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct number of genre content', () => {
    expect(wrapper.findAll('[data-test-id="genre-list-item"]').length).toBe(2);
  });
});
