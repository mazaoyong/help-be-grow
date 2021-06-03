import React from 'react';

// 当需要使用很多的数据来联合提交的时候，可以用这个hooks
type ActionFunc = (...args: any[]) => void;
function usePackage<T = any>(
  packageSize: number,
  action: ActionFunc,
): [(pkg: T) => void, () => void] {
  const [pkgs, setPackages] = React.useState<T[]>();

  const loadPackage = React.useCallback((pkg: T) => {
    setPackages((prevPackages) => {
      if (Array.isArray(prevPackages)) {
        return prevPackages.concat(pkg);
      }
      return [pkg];
    });
  }, []);

  const reloadPackage = React.useCallback(() => setPackages([]), []);

  React.useEffect(() => {
    if (pkgs && pkgs.length === packageSize) {
      if (typeof action === 'function') {
        action(...pkgs);
        reloadPackage();
      }
    }
  }, [action, packageSize, pkgs, reloadPackage]);

  return [loadPackage, reloadPackage];
}

export default usePackage;
