import type { VueWrapper } from '@vue/test-utils';

import { mount, RouterLinkStub } from '@vue/test-utils';

import GenreLink from './GenreLink.vue';

function factory(props = {}) {
  return mount(GenreLink, {
    props: {
      name: 'name 2 with @ special / characters',
      ...props,
    },
  });
}

describe('GenreLink', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets the correct to prop value', () => {
    expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({
      name: ROUTE_NAMES.genre,
      params: {
        [ROUTE_PARAM_KEYS.genre.genre]:
          'name%202%20with%20%40%20special%20%2F%20characters',
        [ROUTE_PARAM_KEYS.genre.mediaType]: ROUTE_MEDIA_TYPE_PARAMS.Albums,
      },
    });
  });
});
