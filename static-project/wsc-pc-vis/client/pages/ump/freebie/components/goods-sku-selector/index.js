import React from 'react';
import { Dialog } from 'zent';
import { isEduShop } from '@youzan/utils-shop';
import Selector from './selector';

import './index.scss';

const { openDialog, closeDialog } = Dialog;
const DIALOG_ID = 'GOODS_SKU_SELECTOR';

export const close = () => closeDialog(DIALOG_ID);
export const open = props => {
  openDialog({
    dialogId: DIALOG_ID,
    title: props.title || '添加商品',
    children: <Selector {...props} onCancel={close} />,
    style: props.style,
    className: 'rc-goods-sku-selector_dialog',
    onlineManageUrl: isEduShop ? '/v4/vis/edu/course#/course-manage/list' : '/v4/vis/pct/page/tabs',
  });
};

export default {
  open,
  close,
  Selector,
};
