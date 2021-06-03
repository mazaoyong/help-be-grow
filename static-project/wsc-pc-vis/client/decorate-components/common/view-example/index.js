import React from 'react';
import { Dialog, Button } from 'zent';

import './style/index.scss';

const { openDialog, closeDialog } = Dialog;
const id = 'view_example_dialog';

export default function openViewExampleDialog(goodsType, imageUrl) {
  openDialog({
    dialogId: id,
    title: '查看全部示例',
    children: (
      <div className="view-example-dialog">
        <div className="view-example-dialog__tip">
          {`当${goodsType}商品总数多于所设置显示数量时，可勾选在商品列表底部显示“查看全部”，
          点击进入全部${goodsType}商品列表页`}
        </div>
        <div className="view-example-dialog__img-wrap">
          <img src={`${window._global.url.imgqn}${imageUrl}`} width="282px" height="417px" alt="" />
        </div>
      </div>
    ),
    footer: (
      <Button type="primary" onClick={() => closeDialog(id)}>
        我知道了
      </Button>
    ),
  });
}
