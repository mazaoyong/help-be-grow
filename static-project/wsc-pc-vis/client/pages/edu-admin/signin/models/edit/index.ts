import React from 'react';

import type { UseSigninEditModel } from './types';

const useSigninEditModel: UseSigninEditModel = () => {
  React.useEffect(() => {
    console.log('useSigninEditModel');
  }, []);

  return {};
};

export default useSigninEditModel;
