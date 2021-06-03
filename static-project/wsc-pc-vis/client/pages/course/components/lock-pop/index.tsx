import { Pop } from '@zent/compat';
import React, { FC, useMemo, useState } from 'react';
import { Disabled } from 'zent';
import { checkFieldDisabled } from 'fns/lock-field';

interface ILockPopWrapperProps {
  keyName: string;
  productLock: any[];
}

const LockPopWrapper: FC<ILockPopWrapperProps> = ({ keyName = '', productLock = [], children }) => {
  const [visible, setVisible] = useState(false);

  const { disabled, disabledMsg } = useMemo(
    () =>
      checkFieldDisabled({
        key: keyName,
        productLock,
        needFilter: true,
      }),
    [keyName, productLock],
  );

  const handleShow = () => {
    if (disabledMsg) {
      setVisible(true);
    }
  };

  const handleHide = () => {
    if (disabledMsg) {
      setVisible(false);
    }
  };

  return (
    <Pop position="top-left" block content={disabledMsg} visible={visible}>
      <Disabled value={!!disabled}>
        <div onMouseOver={handleShow} onMouseOut={handleHide}>
          {children}
        </div>
      </Disabled>
    </Pop>
  );
};

export default LockPopWrapper;
