import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useAPI } from './index';

const { getImageUrl, getStreamUrl } = useAPI();

mockNuxtImport(
  'useCookie',
  () => () =>
    ref(
      'token=token&salt=salt&server=https://www.server.com&username=username',
    ),
);

describe('useAPI', () => {
  describe('getImageUrl', () => {
    describe('when id is undefined', () => {
      it('returns the correct value', () => {
        expect(getImageUrl()).toBe('https://placehold.co/500x500');
      });
    });

    describe('when id is defined', () => {
      it('returns the correct value', () => {
        expect(getImageUrl('id')).toBe(
          'https://www.server.com/rest/getCoverArt?s=salt&t=token&u=username&c=web&f=json&v=1.15.0&id=id&size=500',
        );
      });
    });

    describe('when size is set', () => {
      it('returns the correct value', () => {
        expect(getImageUrl('id', 123)).toBe(
          'https://www.server.com/rest/getCoverArt?s=salt&t=token&u=username&c=web&f=json&v=1.15.0&id=id&size=123',
        );
      });
    });
  });

  describe('getStreamUrl', () => {
    describe('when id is undefined', () => {
      it('returns the correct value', () => {
        expect(getStreamUrl()).toBe('');
      });
    });

    describe('when id is defined', () => {
      it('returns the correct value', () => {
        expect(getStreamUrl('id')).toBe(
          'https://www.server.com/rest/stream?s=salt&t=token&u=username&c=web&f=json&v=1.15.0&id=id',
        );
      });
    });
  });
});
