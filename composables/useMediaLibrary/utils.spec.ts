import { TRACK_BLOB } from '@/test/fixtures';
import { getFormattedTracksMock } from '@/test/helpers';

import { downloadFileFromBlob } from './utils';

const appendChildSpy = vi.spyOn(document.body, 'appendChild');
const removeChildSpy = vi.spyOn(document.body, 'removeChild');
const createObjectURLSpy = vi
  .spyOn(window.URL, 'createObjectURL')
  .mockReturnValue('blob:url');
const revokeObjectURLSpy = vi.spyOn(window.URL, 'revokeObjectURL');

const anchor = document.createElement('a');
const clickSpy = vi.spyOn(anchor, 'click');
vi.spyOn(document, 'createElement').mockReturnValue(anchor);

const track = getFormattedTracksMock()[0];

describe('downloadFileFromBlob', () => {
  beforeAll(() => {
    downloadFileFromBlob(TRACK_BLOB, track);
  });

  it('calls the createObjectURL with blob', () => {
    expect(createObjectURLSpy).toHaveBeenCalledWith(TRACK_BLOB);
  });

  it('sets the anchor element with correct attributes', () => {
    const appendedAnchor = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;

    expect(appendedAnchor.tagName).toBe('A');
    expect(appendedAnchor.href).toBe('blob:url');
    expect(appendedAnchor.download).toBe(track.name);
  });

  it('calls the document.body.appendChild function', () => {
    expect(appendChildSpy).toHaveBeenCalledWith(anchor);
  });

  it('calls the click event on the anchor element', () => {
    expect(clickSpy).toHaveBeenCalled();
  });

  it('calls the document.body.removeChild function', () => {
    expect(removeChildSpy).toHaveBeenCalledWith(anchor);
  });

  it('calls the window.URL.revokeObjectURL function', () => {
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url');
  });

  describe('when track name is longer than 50 characters', () => {
    beforeAll(() => {
      downloadFileFromBlob(TRACK_BLOB, {
        ...track,
        name: 'name '.repeat(100),
      });
    });

    it('sets the anchor element with correct download attribute', () => {
      const appendedAnchor = appendChildSpy.mock
        .calls[0][0] as HTMLAnchorElement;

      expect(appendedAnchor.download).toBe(
        'name-name-name-name-name-name-name-name-name-name-',
      );
    });
  });
});
