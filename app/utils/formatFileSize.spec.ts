describe('formatFileSize', () => {
  describe.each([
    [1048576, '1.00 MB'],
    [2097152, '2.00 MB'],
    [1073741824, '1.00 GB'],
    [1024, '1.00 KB'],
    ['1048576', '1.00 MB'],
    ['2097152', '2.00 MB'],
    ['1073741824', '1.00 GB'],
    ['1024', '1.00 KB'],
    [undefined, EMPTY_DISPLAY_VALUE],
    [Number.NaN, EMPTY_DISPLAY_VALUE],
    ['invalid', EMPTY_DISPLAY_VALUE],
    ['', EMPTY_DISPLAY_VALUE],
  ])('when bytes is %s', (input, expected) => {
    it('returns the correct response', () => {
      expect(formatFileSize(input)).toBe(expected);
    });
  });
});
