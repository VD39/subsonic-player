import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import NoMediaMessage from './NoMediaMessage.vue';

function factory(props = {}) {
  return mount(NoMediaMessage, {
    props: {
      icon: 'PhPlaylist',
      message: 'Message',
      ...props,
    },
  });
}

describe('NoMediaMessage', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
