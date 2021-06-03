import React, { FC, useState } from 'react';
import { Button } from 'zent';
import { TSigninDialogFooterProps } from '../types';

const DialogFooter: FC<TSigninDialogFooterProps> = (props) => {
  const { onCancel = () => {}, onConfirm = () => {}, event } = props;
  const [loading, setLoading] = useState(false);
  return <div>
    <Button loading={loading} onClick={onCancel}>取消</Button>
    <Button loading={loading} type='primary' onClick={() => {
      setLoading(true);
      event && event.emit('onConfirmClick');
      onConfirm();
    }}>确定</Button>
  </div>;
};

export default DialogFooter;
