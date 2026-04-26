import type { VueWrapper } from '@vue/test-utils';

import { mount } from '@vue/test-utils';

import { appInformationMock, serverInformationMock } from '@/test/fixtures';

import AboutApp from './AboutApp.vue';

function factory(props = {}) {
  return mount(AboutApp, {
    props: {
      appInformation: appInformationMock,
      serverInformation: serverInformationMock,
      ...props,
    },
  });
}

describe('AboutApp', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when the serverInformation prop name key is defined', () => {
    it('shows the server name element', () => {
      expect(wrapper.find({ ref: 'name' }).exists()).toBe(true);
    });
  });

  describe('when the serverInformation prop name key is not defined', () => {
    beforeEach(() => {
      wrapper = factory({
        serverInformation: {
          ...serverInformationMock,
          name: undefined,
        },
      });
    });

    it('does not show the server name element', () => {
      expect(wrapper.find({ ref: 'name' }).exists()).toBe(false);
    });
  });

  describe('when the serverInformation prop version key is defined', () => {
    it('shows the server version element', () => {
      expect(wrapper.find({ ref: 'version' }).exists()).toBe(true);
    });
  });

  describe('when the serverInformation prop version key is not defined', () => {
    beforeEach(() => {
      wrapper = factory({
        serverInformation: {
          ...serverInformationMock,
          version: undefined,
        },
      });
    });

    it('does not show the server version element', () => {
      expect(wrapper.find({ ref: 'version' }).exists()).toBe(false);
    });
  });

  describe('when the serverInformation prop openSubsonic key is defined', () => {
    it('shows the openSubsonic element', () => {
      expect(wrapper.find({ ref: 'openSubsonic' }).exists()).toBe(true);
    });
  });

  describe('when the serverInformation prop openSubsonic key is not defined', () => {
    beforeEach(() => {
      wrapper = factory({
        serverInformation: {
          ...serverInformationMock,
          openSubsonic: undefined,
        },
      });
    });

    it('does not show the openSubsonic element', () => {
      expect(wrapper.find({ ref: 'openSubsonic' }).exists()).toBe(false);
    });
  });
});
