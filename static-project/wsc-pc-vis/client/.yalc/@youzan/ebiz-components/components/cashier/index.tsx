import React from 'react';
import { Dialog, closeDialog } from 'zent';
import Cashier from './cashier';
import { ICashierProps } from './types';

const { openDialog } = Dialog;

const cashierId = 'cashierId';

export function openCashier(props: ICashierProps) {
  openDialog({
    dialogId: cashierId,
    title: '收款',
    className: 'edu-enrollment-payment',
    children: <Cashier {...props} />,
  });
}

export function closeCashier() {
  closeDialog(cashierId);
}

export default {
  Cashier,
  openCashier,
  closeCashier,
};

export * from './types';
