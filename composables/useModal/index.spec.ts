import { useModal } from './index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const events: any = {};

document.addEventListener = vi.fn((event, cb) => {
  events[event] = cb;
});

const { close, modal, openAddPlaylistModal } = useModal();

describe('useModal', () => {
  it('sets the default modal value', () => {
    expect(modal.value).toEqual(DEFAULT_STATE);
  });

  describe('when openAddPlaylistModal function is called', () => {
    beforeEach(() => {
      openAddPlaylistModal();
    });

    describe('when attrs are not set', () => {
      it('sets the correct modal value', () => {
        expect(modal.value).toEqual({
          component: expect.any(Object),
          title: 'Add playlist',
          attrs: {},
        });
      });
    });

    describe('when attrs are set', () => {
      beforeEach(() => {
        openAddPlaylistModal({
          attrs: 'attrs',
        });
      });

      it('sets the correct modal value', () => {
        expect(modal.value).toEqual({
          component: expect.any(Object),
          title: 'Add playlist',
          attrs: {
            attrs: 'attrs',
          },
        });
      });

      describe('when a non esc key is pressed', () => {
        beforeEach(() => {
          events.keydown({ key: 'Shift' });
        });

        it('does not reset the modal value', () => {
          expect(modal.value).toEqual({
            component: expect.any(Object),
            title: 'Add playlist',
            attrs: {
              attrs: 'attrs',
            },
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
  });

  describe('when close function is called', () => {
    beforeEach(() => {
      openAddPlaylistModal();
      close();
    });

    it('resets modal value to default state', () => {
      expect(modal.value).toEqual(DEFAULT_STATE);
    });
  });
});
