import React, { useState } from 'react';
import { Button, Checkbox } from 'zent';

export const Foot = (props) => {
  const { onStopSellCancel, onStopSellOK } = props;
  const [ checked, setChecked ] = useState(false);
  return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <Checkbox style={{ color: '#979797', lineHeight: '30px' }} checked={checked} onChange={(e) => { setChecked(e.target.checked); }}>本次设置不再提示此弹窗</Checkbox>
    <div>
      <Button onClick={onStopSellCancel} >取消</Button>
      <Button onClick={() => onStopSellOK(checked)} type="primary" >确定</Button>
    </div>
  </div>;
};
