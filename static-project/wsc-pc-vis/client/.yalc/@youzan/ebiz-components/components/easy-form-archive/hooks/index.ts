import { useState, useEffect, DependencyList, EffectCallback } from 'react';

export const useMountState = () => {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, [])
  return mount;
}

export const useDepMountState = (deps: DependencyList | undefined, immediate: boolean = true) => {
  const [depMount, setDepMount] = useState(immediate);
  const mount = useMountState();
  useEffect(() => {
    if (mount && !depMount) {
      setDepMount(true);
    }
  }, deps)
  return depMount;
}

export const useUpdateEffect = (fn: EffectCallback, deps: DependencyList, immediate: boolean = true) => {
  const mount = useDepMountState(deps, immediate);
  useEffect(() => {
    mount && fn();
  }, deps);
}
