import { DatePicker } from '@zent/compat';
import React, { useState, useCallback } from 'react';
import { Button } from 'zent';
import { Dialog } from '@youzan/ebiz-components';

const { DialogFooter } = Dialog;
/**
 * 选择跟进时间
 *
 * @param {import("@youzan/ebiz-components").IDialogChildrenProps} param
 * @return {JSX.Element}
 */
const SelectRecordTimeDialog = ({ dialogref }) => {
  const [selectTime, setSelectTime] = useState(new Date());

  const onSubmit = useCallback(() => {
    dialogref.submit(selectTime);
  }, [dialogref, selectTime]);

  return (
    <div className="dialog-content">
      <div className="select-wrap">
        <label className="zent-form__control-label" style={{ width: '112px' }}><em className="zent-form__required">*</em>选择回访时间：</label>  <DatePicker
          className="zent-picker-demo"
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={selectTime}
          onChange={val => setSelectTime(val)}
        />
      </div>
      <DialogFooter>
        <Button onClick={() => dialogref.close()}>取消</Button>
        <Button type="primary" onClick={onSubmit}>保存</Button>
      </DialogFooter>
    </div>
  );
};

export default SelectRecordTimeDialog;
