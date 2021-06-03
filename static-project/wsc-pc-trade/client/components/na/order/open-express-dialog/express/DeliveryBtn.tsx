import React from 'react';
import { Button } from 'zent';

interface IProps {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const DeliveryBtn = ({ loading, disabled, onClick }: IProps) => {
  return (
    <Button loading={loading} disabled={disabled} type="primary" onClick={onClick}>
      发货
    </Button>
  );
};

export default DeliveryBtn;
