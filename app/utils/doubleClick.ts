let timer: ReturnType<typeof setTimeout>;
let clicks = 0;

export function doubleClick(callback: () => void) {
  clicks += 1;

  if (clicks === 1) {
    timer = setTimeout(() => {
      clicks = 0;
    }, 250);
    return;
  }

  /* istanbul ignore next -- @preserve */
  if (clicks === 2) {
    clearTimeout(timer);
    clicks = 0;
    callback();
  }
}
