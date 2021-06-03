import React from 'react';
import get from 'lodash/get';
// @ts-ignore
export const NODE_ENV: string = get(window._global, 'nodeEnv', 'prod');

export const useUpdateTimes = (enabled: boolean, name: string) => {
  const updateTimes = React.useRef(0);

  React.useEffect(() => {
    if (NODE_ENV !== 'prod' && enabled) {
      console.log(`[LOG] render ${name} ${++updateTimes.current} times`);
    }
  });
};
