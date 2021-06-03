// 更新线索状态
import React, { useState, useCallback } from 'react';
import { Radio, Button } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import store from '../../store';
import OrderSelect from './order-select';
import { phases } from '../../config';
import './style.scss';

import { isEduShop } from '@youzan/utils-shop';
const { DialogFooter } = Dialog;
const RadioGroup = Radio.Group;

const ChangePhaseDialog = ({ dialogref, data = {} }) => {
  const { phase } = store.useStoreState();
  const [selected, setSelect] = useState(typeof data.initPhase !== 'undefined' ? data.initPhase : phase);
  const [order, setOrder] = useState({});

  // 更新状态
  const onSubmit = useCallback(() => {
    dialogref.submit({ phase: selected, orderNo: order.orderNo || null });
  }, [dialogref, order.orderNo, selected]);

  return (
    <div className="edu__clue-detail-change-phase-dialog">
      <div className="zent-form__control-group">
        <label className="zent-form__control-label">
          <em className="zent-form__required">*</em>更改阶段：
        </label>
        <RadioGroup value={selected} onChange={e => setSelect(e.target.value)}>
          {phases.map(phase => (
            <Radio key={phase.type} value={phase.type}>
              {phase.text}
            </Radio>
          ))}
        </RadioGroup>
      </div>
      { /* 非教育店铺在更改阶段为已成交的时候不显示选择订单功能 */ }
      <OrderSelect {...order} onOrderChange={setOrder} clueId={data.clueId} show={isEduShop && selected === 6} />
      <DialogFooter>
        <Button onClick={() => dialogref.close()}>取消</Button>
        <Button type="primary" onClick={onSubmit}>
          保存
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ChangePhaseDialog;
