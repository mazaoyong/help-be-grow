import React, { PureComponent } from 'react';
import { Dialog, Button } from 'zent';
import get from 'lodash/get';
// @ts-ignore
import uuid from 'uuid/v4';
import { LockType } from './index';

export { LockType } from './index';

const { openDialog, closeDialog } = Dialog;

export default function openLockDialog(lockType: LockType) {
  return function () {
    const dialogId = uuid();
    openDialog({
      dialogId,
      title: '提示',
      children: <LockDialog lockType={lockType} />,
      footer: (
        <Button type="primary" onClick={() => closeDialog(dialogId, { triggerOnClose: false })}>
          我知道了
        </Button>
      ),
    });
    return Promise.reject();
  };
}

export function onOpenLockDialogClick(isLock: boolean, type: LockType, callback: () => void) {
  return () => {
    isLock ? openLockDialog(type)() : callback();
  };
}

class LockDialog extends PureComponent<{ lockType: LockType }> {
  public render() {
    const { lockType } = this.props;
    const preText = this.getText(lockType);
    const baseUrl = get(window, '_global.url.base', '//www.youzan.com');
    return (
      <div>
        {preText}，详情请至
        <a href={`${baseUrl}/v4/setting/appeal/punish`} target="_blank" rel="noopener noreferrer">
          违规申诉
        </a>
        查看！
      </div>
    );
  }
  private getText(lockType: LockType) {
    switch (lockType) {
      case LockType.PCT_GOODS:
        return '该知识付费商品已被锁定';
      case LockType.PCT_SHOP:
        return '创建知识付费内容功能已被锁定';
      case LockType.COURSE_GOODS:
        return '你发布的线下课商品已被锁定';
      case LockType.COURSE_SHOP:
        return '发布线下课能力已被锁定';
      default:
        return '';
    }
  }
}
