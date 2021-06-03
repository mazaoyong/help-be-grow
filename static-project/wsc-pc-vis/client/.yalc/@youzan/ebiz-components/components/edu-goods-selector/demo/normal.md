---
order: 0
title: 基础用法
subtitle: Basic
---

这里是组件的基础用法

```jsx
import React, { useCallback, useState } from 'react';
import { EduGoodsSelector } from '@youzan/ebiz-components';
import { IChannelSelected } from '@youzan/ebiz-components/components/edu-goods-selector';
import '@youzan/react-components/es/components/goods-selector-v2/style';

const { GoodsSelector } = EduGoodsSelector;
const BasicDemo = (props) => {
  const [selected, setSelected] = useState<IChannelSelected>({ type: 'part', value: [] });

  const onConfirm = useCallback((data: IChannelSelected) => {
    setSelected(data);
  }, []);

  return (
    <div>
      <GoodsSelector
        selected={selected}
        btnText="选择商品"
        selectTypes={['part']}
        onConfirm={onConfirm}
      />
      <p>-</p>
      <p>已选择课程：</p>
      {selected.type === 'all' ? (
        <p>全部课程</p>
      ) : (
        <ul>
          {selected.value.map((item) => {
            return <li key={item.goodsId}>{item.goodsName}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

ReactDOM.render(<BasicDemo />, mountNode);
```
