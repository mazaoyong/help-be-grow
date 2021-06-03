// 列表操作按钮
import React, { FC, useMemo, ReactElement } from 'react';
import { LockWrap } from '@youzan/ebiz-components';
import { LockType } from '@youzan/ebiz-components/es/lock-wrap';
import { Operations } from '@youzan/react-components';
import './style.scss';

export interface IConfigItem {
  title: string | ReactElement;
  onClick?: (params: any | null) => void;
  isLock?: boolean;
  show?: boolean;
  showLock?: boolean;
  lockType?: LockType;
  disabled?: boolean;
}

interface IProps {
  config: IConfigItem[];
  maxDisplayItemNum?: number;
}

const ListActionMenu: FC<IProps> = ({ config, maxDisplayItemNum = 4 }) => {
  const items = useMemo(
    () =>
      config.filter(({ show }) => {
        return typeof show === 'undefined' || show;
      }),
    [config],
  );

  const actions = useMemo(() => {
    return items.map((item, i) => {
      const {
        title,
        onClick,
        showLock,
        lockType = LockType.PCT_GOODS,
        isLock = false,
        disabled = false,
      } = item;

      if (disabled) {
        return <span className="list-action-item list-action-item--disabled">{title}</span>;
      }

      return showLock ? (
        <div className="list-action-item" key={i}>
          <LockWrap lockType={lockType} isLock={isLock} onClick={onClick}>
            {title}
          </LockWrap>
        </div>
      ) : (
        <div key={i} className="list-action-item" onClick={onClick}>
          {title}
        </div>
      );
    });
  }, [items]);

  return <Operations className="list-action-menu" items={actions} maxDisplayItemNum={maxDisplayItemNum} />;
};

export default ListActionMenu;
