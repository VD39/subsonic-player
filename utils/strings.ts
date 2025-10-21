export function convertToTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((part) => {
      let i = 0;

      while (i < part.length && !/[a-z]/i.test(part[i])) {
        i++;
      }

      return (
        part.slice(0, i) +
        part.slice(i).replaceAll(/\b\w/g, (c) => c.toUpperCase())
      );
    })
    .join(' ');
}

export function generateRandomString(length = 15) {
  return Array.from({ length }, () =>
    Math.random().toString(36).charAt(2),
  ).join('');
}

export function replaceCharactersWithSpace(
  str: string,
  replaceCharacter = '-',
) {
  return str.replaceAll(replaceCharacter, ' ');
}

export function replaceSpacesWithCharacter(
  str: string,
  replaceCharacter = '-',
) {
  return str.replaceAll(/ +/g, replaceCharacter);
}

export function sanitiseString(str: string) {
  return str.replaceAll(/\W|_/g, ' ').replaceAll(/ +/g, ' ').trim();
}

export function splitCamelCase(str: string) {
  return str.replaceAll(/([A-Z])/g, ' $1');
}
