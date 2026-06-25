export function convertToTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((part) => {
      let index = 0;

      while (index < part.length && !/[a-z]/i.test(part[index])) {
        index++;
      }

      return (
        part.slice(0, index) +
        part
          .slice(index)
          .replaceAll(
            /(^|[^a-zA-Z0-9'\u2019])([a-zA-Z])/g,
            (_, start, letter) => start + letter.toUpperCase(),
          )
      );
    })
    .join(' ');
}

export function formatListToString(items: string[]) {
  if (!items.length) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return items.join(' & ');
  }

  return `${items.slice(0, -1).join(', ')} & ${items.at(-1)}`;
}

export function generateRandomString(length = 15) {
  return Array.from({ length }, () =>
    Math.random().toString(36).charAt(2),
  ).join('');
}

export function normaliseStringToWords(str: string) {
  return str.replaceAll(/\W|_/g, ' ').replaceAll(/ +/g, ' ').trim();
}

export function replaceCharacterWithSpace(str: string, replaceCharacter = '-') {
  return str.replaceAll(replaceCharacter, ' ');
}

export function replaceSpaceWithCharacter(str: string, replaceCharacter = '-') {
  return str.replaceAll(/ +/g, replaceCharacter);
}

export function splitCamelCase(str: string) {
  return str.replaceAll(/([A-Z])/g, ' $1');
}
