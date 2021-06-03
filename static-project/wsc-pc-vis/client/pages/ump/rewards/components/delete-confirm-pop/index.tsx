import React, { FC } from 'react';
import { Pop, Popover, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import './style.scss';

interface IPopActivityCheckProps extends Record<'pop', Popover> {
  rewardActivityId: number;
  status: number;
  updateStatus: () => any;
  refresh: () => any;
}
// 点击 close 按钮可以关闭弹层
const Content: FC<IPopActivityCheckProps> = ({ pop, status, updateStatus, refresh }) => {
  const deleteText = status === 2 ? '失效' : '删除';
  return (
    <div className="delete-pop__wrap">
      <div style={{ marginBottom: '16px' }}>{`${deleteText}后将不可恢复，确定${deleteText}?`}</div>
      <div style={{ textAlign: 'right' }}>
        <SamButton
          onClick={() => {
            pop.close();
          }}
        >
          取消
        </SamButton>
        <SamButton
          name="编辑"
          type="primary"
          onClick={() => {
            updateStatus()
              .then(() => {
                pop.close();
                refresh();
              })
              .catch(() => {
                Notify.error('修改奖励状态失败');
                pop.close();
              });
          }}
        >
          { deleteText }
        </SamButton>
      </div>
    </div>
  );
};

const ContentWithPop = Pop.withPop(Content) as any;

const PopContent = ({ activityId, updateStatus, status, refresh, children }) => {
  return (
    <Pop
      trigger="click"
      position="top-right"
      content={
        <ContentWithPop
          rewardActivityId={activityId}
          status={status}
          updateStatus={updateStatus}
          refresh={refresh}
        />
      }
    >
      {children}
    </Pop>
  );
};

export default PopContent;
