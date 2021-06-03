function mapKeys(targetObj: object): string[] {
  if (typeof targetObj === 'object') {
    const keys = Object.keys(targetObj);
    if (keys.length) return [keys[0]];
  }
  return [];
}

export default mapKeys;
