import { useEffect } from 'react';

export const useDidMount = (mount: () => void) => useEffect(mount, []);
