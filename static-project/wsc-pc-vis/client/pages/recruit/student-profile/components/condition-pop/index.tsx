import { Pop, IPopProps } from '@zent/compat';
import React, { FC } from 'react';

const DefeatableDialog: FC<{disabled: boolean, addonProps: IPopProps}> = props => {
  if (props.disabled === false) {
    return <>{props.children}</>;
  }

  return (
    <Pop {...props.addonProps}>
      {props.children}
    </Pop>
  );
};

export default DefeatableDialog;
