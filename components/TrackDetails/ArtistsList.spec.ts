import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import ArtistsList from './ArtistsList.vue';

function factory(props = {}) {
  return mount(ArtistsList, {
    props: {
      artists: [
        {
          id: 'id',
          name: 'name',
        },
        {
          id: 'id1',
          name: 'name1',
        },
      ],
      ...props,
    },
  });
}

describe('ArtistsList', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows the correct number of artist content', () => {
    expect(wrapper.findAll('[data-test-id="artist-list-item"]').length).toBe(2);
  });
});
