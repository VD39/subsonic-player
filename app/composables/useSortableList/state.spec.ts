import { useSortableListState } from './state';

vi.useFakeTimers();

describe('useSortableListState', () => {
  let composable: ReturnType<typeof useSortableListState>;

  beforeAll(() => {
    composable = useSortableListState();
  });

  it('sets the default isDragging value', () => {
    expect(composable.isDragging.value).toBe(false);
  });

  describe('when the setDraggingState function is called', () => {
    describe('when the dragging param is false', () => {
      beforeEach(() => {
        composable.setDraggingState(false);
      });

      it('does not update the isDragging value', () => {
        expect(composable.isDragging.value).toBe(false);
      });
    });

    describe('when the dragging param is true', () => {
      beforeEach(() => {
        composable.setDraggingState(true);
      });

      it('sets the isDragging value to true', () => {
        expect(composable.isDragging.value).toBe(true);
      });

      describe('when 0ms has passed', () => {
        beforeEach(() => {
          vi.advanceTimersByTime(0);
        });

        it('sets the isDragging value to false', () => {
          expect(composable.isDragging.value).toBe(false);
        });
      });
    });

    describe('when the setDraggingState function is called multiple times', () => {
      beforeEach(() => {
        composable.setDraggingState(true);
        composable.setDraggingState(false);
        composable.setDraggingState(true);
        composable.setDraggingState(false);
        composable.setDraggingState(true);
      });

      it('sets the isDragging value to true', () => {
        expect(composable.isDragging.value).toBe(true);
      });

      describe('when 0ms has passed', () => {
        beforeEach(() => {
          vi.advanceTimersByTime(0);
        });

        it('sets the isDragging value to false', () => {
          expect(composable.isDragging.value).toBe(false);
        });
      });
    });
  });
});
