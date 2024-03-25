export function splitCamelCase(str: string) {
  return str.replace(/([A-Z])/g, ' $1');
}
