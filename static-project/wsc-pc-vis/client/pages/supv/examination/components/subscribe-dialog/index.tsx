import React from 'react';
import { Dialog, Button } from 'zent';

export default function openSubscribeDialog() {
  const { openDialog, closeDialog } = Dialog;
  const id = 'subscribe-dialog';

  let tipText = '';
  const { lifecycle } = window._global;
  const isShopValid = lifecycle!.lifecycleStatus === 'valid';
  if (isShopValid) {
    tipText = '考试服务已到期，如需正常使用，请先订购。';
  } else {
    tipText = '店铺已打烊，请续费后继续使用该功能。';
  }

  const to = () => {
    let path = '';
    if (isShopValid) {
      path = '/v4/subscribe/appmarket/appdesc/board?id=50259';
    } else {
      path = '/v4/subscribe/serve/recommend?itemId=7252';
    }
    window.location.href = `//www.youzan.com${path}`;
  };

  openDialog({
    dialogId: id,
    title: '订购提醒',
    children: <div>{tipText}</div>,
    footer: (
      <div>
        <Button onClick={() => closeDialog(id)}>
          取消
        </Button>
        <Button type="primary" onClick={() => to()}>
          去订购
        </Button>
      </div>
    ),
  });
}
