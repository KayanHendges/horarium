export const isObjectId = (value: any): boolean => {
  return typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value);
};
