import { useViewLayout } from './index';

const { setViewLayout, viewLayout } = useViewLayout();

describe('useViewLayout', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets the default viewLayout value', () => {
    expect(viewLayout.value).toBe('gridLayout');
  });

  describe.each([undefined, 'gridLayout', 'listLayout'])(
    'when the setViewLayout function is called with %s',
    (layout) => {
      beforeEach(() => {
        setViewLayout(layout as Layout);
      });

      it('sets the correct viewLayout value', () => {
        expect(viewLayout.value).toBe(layout || 'gridLayout');
      });
    },
  );
});
