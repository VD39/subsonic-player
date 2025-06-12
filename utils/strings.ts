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
        part.slice(i).replace(/\b\w/g, (c) => c.toUpperCase())
      );
    })
    .join(' ');
}

export function generateRandomString(length = 15) {
  return [...Array(length)]
    .map(() => Math.random().toString(36).charAt(2))
    .join('');
}

export function replaceCharactersWithSpace(
  str: string,
  replaceCharacter = '-',
) {
  return str.replace(new RegExp(replaceCharacter, 'g'), ' ');
}

export function replaceSpacesWithCharacter(
  str: string,
  replaceCharacter = '-',
) {
  return str.replace(/ +/g, replaceCharacter);
}

export function sanitiseString(str: string) {
  return str.replace(/\W|_/g, ' ').replace(/ +/g, ' ').trim();
}

export function splitCamelCase(str: string) {
  return str.replace(/([A-Z])/g, ' $1');
}
