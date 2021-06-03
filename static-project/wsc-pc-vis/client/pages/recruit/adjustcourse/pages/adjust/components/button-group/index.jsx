import React from 'react';
import { Button as SamButton } from '@youzan/sam-components';
import AmountDisplay from '../amount-display';

export default function ButtonGroup({ prefixcls = '', amount }) {
  return (
    <div className={`${prefixcls}-button-group`}>
      <AmountDisplay prefixcls={prefixcls} className='inline' label='应收金额' amount={amount} />
      <SamButton
        name="确认转课"
        className={`${prefixcls}-button-group-submit`}
        type="primary"
        htmlType="submit"
      >
        确认转课
      </SamButton>
    </div>
  );
}
