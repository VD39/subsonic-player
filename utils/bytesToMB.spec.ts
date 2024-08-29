describe('bytesToMB', () => {
  describe.each([
    [1048576, '1.00 MB'],
    [2097152, '2.00 MB'],
    [1073741824, '1.00 GB'],
    [1024, '1.00 KB'],
    ['1048576', '1.00 MB'],
    ['2097152', '2.00 MB'],
    ['1073741824', '1.00 GB'],
    ['1024', '1.00 KB'],
    [NaN, ''],
    ['invalid', ''],
    ['', ''],
  ])('when bytes is %s', (input, expected) => {
    it('returns the correct value', () => {
      expect(bytesToMB(input)).toBe(expected);
    });
  });
});
