export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay = 200,
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);

    return new Promise<Error | ReturnType<T>>((resolve, reject) => {
      timer = setTimeout(() => {
        try {
          resolve(callback(...args));
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
