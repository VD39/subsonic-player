import { getPointerPosition } from './pointerEvent';

vi.unmock('./pointerEvent');

describe('getPointerPosition', () => {
  describe('when event is not defined', () => {
    it('returns the correct response', () => {
      expect(getPointerPosition()).toBe(undefined);
    });
  });

  describe('when event is a touch event', () => {
    describe('when touches is not an empty array', () => {
      it('returns the correct response', () => {
        expect(
          getPointerPosition({
            touches: [
              {
                clientX: 50,
                clientY: 100,
              } as Touch,
            ],
          } as unknown as TouchEvent),
        ).toEqual(
          expect.objectContaining({
            clientX: 50,
            clientY: 100,
          }),
        );
      });
    });

    describe('when touches is an empty array and changedTouches is not an empty array', () => {
      it('returns the correct response', () => {
        expect(
          getPointerPosition({
            changedTouches: [
              {
                clientX: 75,
                clientY: 125,
              } as Touch,
            ],
            touches: [],
          } as unknown as TouchEvent),
        ).toEqual(
          expect.objectContaining({
            clientX: 75,
            clientY: 125,
          }),
        );
      });
    });

    describe('when touches and changedTouches are empty arrays', () => {
      it('returns the correct response', () => {
        expect(
          getPointerPosition({
            changedTouches: [],
            touches: [],
          } as unknown as TouchEvent),
        ).toBe(undefined);
      });
    });
  });

  describe('when event is a mouse event', () => {
    it('returns the correct response', () => {
      expect(
        getPointerPosition({
          clientX: 200,
          clientY: 300,
        } as unknown as MouseEvent),
      ).toEqual(
        expect.objectContaining({
          clientX: 200,
          clientY: 300,
        }),
      );
    });
  });
});
