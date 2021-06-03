import { useEffect } from 'react';

export const useUnmount = (unmount: () => void) => {
  useEffect(
    () => () => {
      if (unmount) {
        unmount();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
