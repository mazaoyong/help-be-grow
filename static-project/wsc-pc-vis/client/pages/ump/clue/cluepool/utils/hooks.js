import { useEffect } from 'react';

export const useDidMount = fn => useEffect(() => fn && fn(), []);

export const useWillUnmount = fn => useEffect(() => () => fn && fn(), []);
