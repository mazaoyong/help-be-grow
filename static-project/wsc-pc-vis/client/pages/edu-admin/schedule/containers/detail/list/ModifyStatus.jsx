import React, { useState } from 'react';
import { Radio, Button, Dialog } from 'zent';
import { number } from '@youzan/utils';
import '../styles.scss';

const { Group } = Radio;
const { closeDialog } = Dialog;
const prefix = cls => `modify-status_${cls}`;

const statusMap = {
  4: 0,
  7: 1,
  6: 2,
};

const ModifyStatus = props => {
  const { data, handleModifyStatus, dialogId, settings = {} } = props;
  const [status, setStatus] = useState(statusMap[data.signInStatus || 4]);

  const emitModifyStatus = () => {
    closeDialog(dialogId);
    if (handleModifyStatus) {
      handleModifyStatus(status, data);
    }
  };

  // 渲染消耗课时文案
  const renderConsumeTime = () => {
    const { profile } = props;
    if (props.data.consumeNum === -1) return null;
    if (status === 1 && !settings.writeOffRuleLeave) return null;
    if (status === 2 && !settings.writeOffRuleTruancy) return null;
    if (data.signInStatus === 4 && status === 0) return null;
    if (profile.consumeNum === 0) return null;
    return <p>本节课消耗学员{number.accDiv(profile.consumeNum || 0, 100)}课时</p>;
  };

  return (
    <div className={prefix('box')}>
      <div className={prefix('name')}>当前选中学员:{data.student.name}</div>
      <div className={prefix('radio-group')}>
        更改状态:
        <Group onChange={evt => setStatus(evt.target.value)} value={status}>
          <Radio value={0} disabled={data.signInStatus === 4}>
            签到
          </Radio>
          <Radio value={1} disabled={data.signInStatus === 7}>
            请假
          </Radio>
          <Radio value={2} disabled={data.signInStatus === 6}>
            未到
          </Radio>
        </Group>
      </div>
      {renderConsumeTime()}
      <div className={prefix('footer')}>
        <Button onClick={() => closeDialog(dialogId)}>
          取消
        </Button>
        <Button type="primary" onClick={emitModifyStatus}>
          确认
        </Button>
      </div>
    </div>
  );
};

export default ModifyStatus;
