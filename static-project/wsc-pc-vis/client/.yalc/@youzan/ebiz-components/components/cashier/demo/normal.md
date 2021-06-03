---
order: 0
title: 基础用法
subtitle: Basic
---

```jsx
import { Button } from 'zent';
import { Cashier } from '@youzan/ebiz-components';

const { openCashier, closeCashier } = Cashier;

const BasicDemo = props => {
  return (
    <Button onClick={() => {
      openCashier({
        orderId: '012',
        orderNo: '123',
        price: 10000,
        payUrl: 'http://baidu.com',
        prePayId: '234',
        getWscQrcodeApi: () => Promise.resolve('http://pic.90sjimg.com/design/01/24/80/47/5906e618b27fb.png!/fw/250/quality/90/unsharp/true/compress/true/canvas/250x265/cvscolor/FFFFFFFF'),
        getOrderInfoApi: () => Promise.resolve({
          mainOrderInfo: {
            payState: 2
          }
        }),
        getPayToolsApi: () => Promise.resolve([]),
        onPay: ({ authCode, orderNo, prepayId, payTool }) => {},
        onCancel: () => {
          closeCashier();
        }
      })
    }}>
      继续收款
    </Button>
  );
}

ReactDOM.render(<BasicDemo />, mountNode);
```
