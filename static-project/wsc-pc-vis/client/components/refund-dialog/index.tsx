import React from 'react';
import { Dialog, Button, Notify } from 'zent';
import { isBranchStore } from '@youzan/utils-shop';
import { INSUFFICIENT_STORE_BALANCE, REFUND_ORDER_CREATION_FAILED } from 'constants/api-code';

const { openDialog, closeDialog } = Dialog;

const DIALOG_ID = 'SHOP_RECHARGE_DIALOG';

/** 会显示提示弹窗的错误码列表 */
const SHOW_DIALOG_ERROR_CODE = [
  INSUFFICIENT_STORE_BALANCE,
  REFUND_ORDER_CREATION_FAILED,
];

const rechargeUrl = `${_global.url.v4}/assets/recharge`;
const rechargeTips = `${isBranchStore ? '请联系总部充值后继续退课' : '请先充值店铺余额，再退课'}。`;

interface IErrorData {
  code: number;
  msg: string;
}

export const openShopRechargeDialog = (errorData: IErrorData) => {
  const { code, msg } = errorData || {};
  if (!SHOW_DIALOG_ERROR_CODE.includes(code)) {
    Notify.error(msg);
    return;
  }

  /** 店铺余额不足 */
  const isInsufficientStoreBalance = code === INSUFFICIENT_STORE_BALANCE;
  /** 余额不足（可以充值） */
  const isStoreNeedRecharge = isInsufficientStoreBalance && !isBranchStore;

  return openDialog({
    style: { width: '488px' },
    dialogId: DIALOG_ID,
    title: '提示',
    maskClosable: false,
    children: (
      <div style={{ maxHeight: 100, overflowY: 'auto' }}>
        <p>{msg}</p>
        {
          isInsufficientStoreBalance && (
            <p>{rechargeTips}</p>
          )
        }
      </div>
    ),
    footer: (
      <>
        <Button
          type={isStoreNeedRecharge ? 'default' : 'primary'}
          onClick={() => closeDialog(DIALOG_ID)}
        >
          {isStoreNeedRecharge ? '取消' : '我知道了'}
        </Button>

        {/* 店铺余额不足 */}
        {isStoreNeedRecharge && (
          <Button type="primary" href={rechargeUrl} target="_blank">
            前往充值
          </Button>
        )}
      </>
    ),
  });
};
