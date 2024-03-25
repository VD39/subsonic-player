export function generateRandomString(length = 15) {
  return [...Array(length)]
    .map(() => Math.random().toString(36).charAt(2))
    .join('');
}
