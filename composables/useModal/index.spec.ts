import { useModal } from './index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const events: any = {};

document.addEventListener = vi.fn((event, cb) => {
  events[event] = cb;
});

document.removeEventListener = vi.fn();

const { modal, closeModal, openModal } = useModal();

describe('useModal', () => {
  it('sets the default modal value', () => {
    expect(modal.value).toEqual(DEFAULT_STATE);
  });

  describe.each([
    [
      'addPlaylistModal',
      'Add playlist',
      {
        attrs: 'attrs',
      },
    ],
    [
      'addPodcastModal',
      'Add podcast',
      {
        attrs: 'attrs',
      },
    ],
    [
      'addRadioStationModal',
      'Add radio station',
      {
        attrs: 'attrs',
      },
    ],
  ])('when openModal function is called with %s', (modalType, title, attrs) => {
    beforeAll(() => {
      openModal(modalType as ModalType);
    });

    describe('when attrs are not set', () => {
      it('sets the correct modal value', () => {
        expect(modal.value).toEqual({
          component: expect.any(Object),
          title,
          attrs: {},
        });
      });
    });

    describe('when attrs are set', () => {
      beforeAll(() => {
        openModal(modalType as ModalType, attrs);
      });

      it('sets the correct modal value', () => {
        expect(modal.value).toEqual({
          component: expect.any(Object),
          title,
          attrs,
        });
      });
    });

    describe('when a non esc key is pressed', () => {
      beforeEach(() => {
        events.keydown({ key: 'Shift' });
      });

      it('does not reset the modal value', () => {
        expect(modal.value).toEqual({
          component: expect.any(Object),
          title,
          attrs,
        });
      });
    });

    describe('when esc key is pressed', () => {
      beforeEach(() => {
        events.keydown({ key: 'Escape' });
      });

      it('resets modal value to default state', () => {
        expect(modal.value).toEqual(DEFAULT_STATE);
      });
    });
  });

  describe('when openModal function is called with an model type undefined', () => {
    beforeAll(() => {
      openModal('unKnown' as ModalType);
    });

    it('does not set the modal value', () => {
      expect(modal.value).toEqual(DEFAULT_STATE);
    });
  });

  describe('when closeModal function is called', () => {
    beforeEach(() => {
      openModal('addPlaylistModal');
      closeModal();
    });

    it('calls the document.removeEventListener function', () => {
      expect(document.removeEventListener).toHaveBeenCalled();
    });

    it('resets modal value to default state', () => {
      expect(modal.value).toEqual(DEFAULT_STATE);
    });
  });
});
