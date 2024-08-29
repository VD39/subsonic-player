export function splitCamelCase(str: string) {
  return str.replace(/([A-Z])/g, ' $1');
}

export function generateRandomString(length = 15) {
  return [...Array(length)]
    .map(() => Math.random().toString(36).charAt(2))
    .join('');
}

export function sanitiseString(str: string) {
  return str.replace(/\W|_/g, ' ').replace(/ +/g, ' ').trim();
}

export function replaceSpacesWithCharacter(
  str: string,
  replaceCharacter = '-',
) {
  return sanitiseString(str).replace(/ +/g, replaceCharacter);
}

export function replaceCharactersWithSpace(
  str: string,
  replaceCharacter = '-',
) {
  return sanitiseString(str).replace(new RegExp(replaceCharacter, 'g'), ' ');
}
