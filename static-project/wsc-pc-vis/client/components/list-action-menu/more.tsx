// 列表操作按钮
import React, { FC, useMemo, useState } from 'react';
import { Popover } from '@zent/compat';
import { LockWrap } from '@youzan/ebiz-components';
import { LockType } from '@youzan/ebiz-components/es/lock-wrap';
import { IConfigItem } from './index';

interface IProps {
  title?: string;
  actions: IConfigItem[];
}

const ListMoreActionItem: FC<IProps> = (props: IProps) => {
  const { title = '更多', actions = [] } = props;
  const [popoverOpen, toggleSetStatus] = useState(false);

  const actionItems = useMemo<React.ReactNode[]>(() => {
    return actions.filter(({ show }) => {
      return typeof show === 'undefined' || show;
    }).map(({ title, onClick, showLock, lockType = LockType.PCT_GOODS, isLock = false }, index) => {
      return (
        <li key={index}>
          {
            showLock ? (
              <LockWrap
                lockType={lockType}
                isLock={isLock}
                onClick={onClick}
              >
                {title}
              </LockWrap>
            ) : (
              <span onClick={onClick}>{title}</span>
            )
          }
        </li>
      );
    });
  }, [actions]);

  // 关闭开启Popover
  const triggerClosePopover = cb => {
    toggleSetStatus(!popoverOpen);
    if (cb && typeof cb === 'function') {
      cb();
    }
  };

  return (
    <Popover
      position={Popover.Position.AutoBottomCenter}
      display="inline"
      cushion={5}
      visible={popoverOpen}
      onVisibleChange={visible => toggleSetStatus(visible)}
    >
      <Popover.Trigger.Click>
        <span className="list-action-item" onClick={triggerClosePopover} >
          {title}
        </span>
      </Popover.Trigger.Click>
      <Popover.Content>
        <ul className="dropdown-menus">
          {actionItems}
        </ul>
      </Popover.Content>
    </Popover>

  );
};

export default ListMoreActionItem;
