import { useSortableListState } from './state';

const { isDragging, setDraggingState } = useSortableListState();

vi.useFakeTimers();

describe('useSortableListState', () => {
  it('sets the default isDragging value', () => {
    expect(isDragging.value).toBe(false);
  });

  describe('when the setDraggingState function is called', () => {
    describe('when the dragging param is false', () => {
      beforeEach(() => {
        setDraggingState(false);
      });

      it('does not update the isDragging value', () => {
        expect(isDragging.value).toBe(false);
      });
    });

    describe('when the dragging param is true', () => {
      beforeEach(() => {
        setDraggingState(true);
      });

      it('sets the isDragging value to true', () => {
        expect(isDragging.value).toBe(true);
      });

      describe('when 0ms has passed', () => {
        beforeEach(() => {
          vi.advanceTimersByTime(0);
        });

        it('sets the isDragging value to false', () => {
          expect(isDragging.value).toBe(false);
        });
      });
    });

    describe('when the setDraggingState function is called multiple times', () => {
      beforeEach(() => {
        setDraggingState(true);
        setDraggingState(false);
        setDraggingState(true);
        setDraggingState(false);
        setDraggingState(true);
      });

      it('sets the isDragging value to true', () => {
        expect(isDragging.value).toBe(true);
      });

      describe('when 0ms has passed', () => {
        beforeEach(() => {
          vi.advanceTimersByTime(0);
        });

        it('sets the isDragging value to false', () => {
          expect(isDragging.value).toBe(false);
        });
      });
    });
  });
});
