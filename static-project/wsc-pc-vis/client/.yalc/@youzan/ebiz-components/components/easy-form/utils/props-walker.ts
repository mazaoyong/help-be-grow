import isObjectLike from 'lodash/isObjectLike';
export function propWalker<T = any>(predicate: (v: T) => boolean) {
  return function walker(key: string, value: any, dep: number = 1): string[] | undefined {
    if (dep > 10) return undefined;
    if (predicate(value)) return [key];
    else if (isObjectLike(value)) {
      dep += 1;
      const subPaths: string[] = [];
      Object.entries(value).forEach(([subKey, subValue]) => {
        const subPath = walker(subKey, subValue, dep);
        if (subPath) subPaths.push(`${key}.${subPath}`);
      });
      if (subPaths.length) return subPaths;
      return undefined;
    }
    return undefined;
  };
}
