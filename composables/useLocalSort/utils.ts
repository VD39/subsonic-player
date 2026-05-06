export function detectSortType(value: unknown) {
  if (isNumeric(value)) {
    return 'number';
  }

  if (isDate(value)) {
    return 'date';
  }

  return 'string';
}

export function isDate(value: unknown) {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  // Only attempt parsing if it's a string/number and looks like a date.
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
  }

  return false;
}

export function isNumeric(value: unknown) {
  if (typeof value === 'number') {
    return !Number.isNaN(value);
  }

  if (typeof value === 'string' && value.trim() !== '') {
    return !Number.isNaN(Number(value));
  }

  return false;
}
