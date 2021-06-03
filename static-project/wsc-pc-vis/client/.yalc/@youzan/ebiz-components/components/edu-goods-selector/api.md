---
category: 组件
type: 业务组件
title: 教育商品选择器
subtitle: EduGoodsSelector
description: 适用于教育商品的商品选择器（支持营销模式与非营销模式）
---

> 若组件显式指定了 `activityType`，则**开启营销模式**，此时需要向组件提供后端配置信息 `backEndConfig={_global.gsConfig}`

## 使用

营销模式需要传入一个后端配置。

营销配置中心地址：

[http://ump-config-center.qa.qima-inc.com/product](http://ump-config-center.qa.qima-inc.com/product)

参考配置：请筛选活动类型（22）

Node 获取配置代码示例

```js
// 获取商品选择器配置
const gsConfig = await new GoodsSelectorConfigService(ctx).queryGoodsSelectorConfig({
  shopId: ctx.kdtId,
  domain: 'UMP',
  umpType: 22,
});

ctx.setGlobal('gsConfig', gsConfig);
```

用法：

```jsx
<GoodsSelector
  selected={selected}
  activityType={22}
  activityId={activityId} // 编辑活动时需要传入
  backEndConfig={_global.gsConfig}
  onConfirm={onConfirm}
/>
```

## 组件 Props

| 属性名                   | 描述                                                         | 类型                                                  | 是否必填                                      | 生效模式 | 默认值                                    |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------------------------- | --------------------------------------------- | -------- | ----------------------------------------- |
| selected                 | 已选择的商品数据                                             | IChannelSelected                                      |                                               |          |                                           |
| isSingle                 | 是否单选                                                     | boolean                                               |                                               | 非营销   | false |
| isSkuMode                | 是否支持 sku 粒度选择                                        | boolean                                               |                                               | 非营销   | false |
| isOnlyShowEduGoods       | 是否限制只能选择教育商品（默认只能选择教育商品）             | boolean                                               |                                               |          | true |
| isHideManageBtn          | 是否隐藏商品管理按钮                                         | boolean                                               |                                               |          | false |
| activityType             | 活动类型（指定则为营销模式）                                 | number                                                |                                               | 营销     |  |
| activityId               | 商品参与的活动id 编辑时需要传入                              | number                                                |                                               | 营销     |                                           |
| backEndConfig            | 营销活动后端配置                                             | IUmpFieldConfigParams                                 | 营销模式下必填                                | 营销     |                                           |
| biz                      | 支持选择的商品类型                                           | EduGoodsType[]                                        |                                               |          | `['course', 'content', 'column', 'live']` |
| typeFilterOptions | 商品类型筛选项 | ITypeFilterOption[] | | 非营销 | 未限制只能选择教育商品时，默认可选实物商品和课程商品；**只显示教育类商品时无需指定** |
| selectTypes              | 支持选择**全部**或**部分**商品                               | SelectTypes[]                                         |                                               |          | `['all', 'part']`                         |
| maxGoodsNum              | 最多选择多少商品                                             | number                                                |                                               | 非营销   |                                           |
| maxSkuNum                | 最多选择 sku 数量                                            | number                                                |                                               | 非营销   |                                           |
| showTypeFilter           | 是否显示商品类型筛选（默认隐藏）                             | boolean                                               | 若非限制只能选择教育商品时请显式指定为 `true` | 非营销   | false                             |
| showGroupColumn          | 是否显示商品分组列                                   | boolean                                               |                                               |          | true                              |
| showStockColumn          | 是否显示库存列                                   | boolean                                               |                                               |          | true                              |
| showSalesColumn          | 是否显示销量列                                   | boolean                                               |                                               |          | true                                 |
| showJoinActivityColumn   | 是否显示已参与活动列                             | booleam                                               |                                               | 非营销   | true                                 |
| showNotOptionalColumn    | 是否显示不可选原因列                             | boolean                                               |                                               | 非营销   | true                                 |
| showSoldOut              | 是否过滤已售罄商品                                           | boolean                                               |                                               | 非营销   | false                                     |
| showContentFilterSubType | 允许选择内容时，分组筛选是否显示细分类型（图文、音频、视频） | boolean                                               |                                               |    | false                                      |
| soldOutSelectable | 是否可以选择已售罄商品 | boolean | |  | true |
| needSkuInfo              | 选择的商品信息是否需要包含 SKU 信息，isSkuMode 为 true 时无需指定 | boolean                                               |                                               |          | false                                     |
| onConfirm | 选择商品确认回调 | `(result: IChannelSelected) => void;` | 是 | |  |
| mapGoodsValue | 自定义数据筛选函数 | `(item: IGoodsValueItem) => IGoodsValueItem \| void;` |  | |  |
| dictConfig | 商品选择器常量设置拓展（goods-selector-v2的dict配置） | `IDictConfig` | 否 | | |

## 商品选择器常量设置拓展 dictConfig
| 属性名              | 描述                        | 类型                                  | 是否必填  | 生效模式   | 默认值        |
| ------------------ | -------------------------- | ------------------------------------  | -------- | -------- | ------------ |
| isOnlyShowEduGoods | 是否限制只能选择教育商品       | boolean                               |   否     |          |      true     |
| customManageUrl    | 商品管理的自定义链接          | string                                |   否     |          |      ''       |

## 继承 SelectorDialogProps

| 属性名          | 描述                            | 类型                                  | 是否必填 | 生效模式 | 默认值       |
| --------------- | ------------------------------- | ------------------------------------- | -------- | -------- | ------------ |
| width           | 宽度                            | number                                |          |          |              |
| btnTxt          | 按钮的文案                      | string                                |          |          | 选择商品     |
| closeBtn        | dialog 是否展示右上角的关闭按钮 | boolean                               |          |          | true         |
| disabled        | 是否禁用选择                    | boolean                               |          |          | false        |
| dialogTitle     | dialog 的标题                   | string                                |          |          | 选择可用商品 |
| btnClassName    | 按钮的 className                | string                                |          |          |              |
| maskClosable    | dialog 点击蒙层是否可以关闭     | boolean                               |          |          | false        |
| dialogClassName | dialog 的 className             | string                                |          |          |              |
| onClose         | 关闭 dialog 时触发              | `() => void;`                         |          |          |              |
| visible         | 控制 dialog 是否显示            | boolean                               |          |          |              |
| onCancel        | 点取消按钮触发                  | `(result: ISelectResult) => void;`    |          |          |              |
| beforeSelectOk  | 点确定按钮触发                  | `(result: ISelectResult) => boolean;` |          |          |              |

#### 支持选择的商品类型

```typescript
export type EduGoodsType =
  | 'course'
  | 'content'
  | 'column'
  | 'live'
  | 'contentText'
  | 'contentAudio'
  | 'contentVideo';
```

#### 已选择的商品数据

```typescript
export interface IChannelSelected {
    type: SelectType;
    value: any[];
}
```

#### 营销活动后端配置

```typescript
export interface IUmpFieldConfigParams {
  goodsSelectTypeList: GoodsSelectType[];
  componentList: ComponentList[];
  extraMap: IExtraMap;
  goodsClusterTypeList: Array<{ name: string; code: string; num: number }>;
  goodsSourceShopList: Array<{
    shopId: number;
    shopDisplayName: string;
  }>;
}

export enum ComponentList {
  JOIN_ACTIVITY = 'JOIN_ACTIVITY',
  NOT_OPTIONAL_REASON = 'NOT_OPTIONAL_REASON',
  ITEM_GROUP = 'ITEM_GROUP',
  RADIO_BUTTON = 'RADIO_BUTTON',
  CHECK_BOX = 'CHECK_BOX',
  ITEM_TYPE_SELECTOR = 'ITEM_TYPE_SELECTOR',
  SOURCE_SHOP_GROUP = 'SOURCE_SHOP_GROUP',
  SKU = 'SKU',
}

export interface IExtraMap {
  // 对正反选都生效
  onlineGoodsMaxNum: number;
  offlineGoodsMaxNum: number;
  goodsMaxNum: number;
  onlineGroupMaxNum: number;
  offlineGroupMaxNum: number;
  groupMaxNum: number;
  maxSkuNum: number;
}
```

#### 商品类型筛选项 `typeFilterOptions`

```typescript
// 非营销模式下可自定义商品类型筛选项，默认值可选项为实物商品和课程商品
// e.g
import React, { FC, useState } from 'react';
import { EduGoodsSelector } from '@youzan/ebiz-components';
import { NORMAL_TYPE, TIMED_PRODUCT_LAUNCH_TYPE } from '@youzan/ebiz-components/es/edu-goods-selector';
import { IChannelSelected } from '@youzan/react-components/typings/components/goods-selector-v2';
const { GoodsSelector } = EduGoodsSelector;

function EduGSDemo: FC = (props) => {
  const [selected, setSelected] = useState<IChannelSelected>({ type: 'part', value: [] });
  const onConfirm = useCallback((data: IChannelSelected) => {
    console.log(data);
    setSelected(data);
  }, []);

  return (
    <GoodsSelector
      selected={selected}
      onConfirm={onConfirm}
      showContentFilterSubType
      showTypeFilter
      isOnlyShowEduGoods={false}
      typeFilterOptions={[NORMAL_TYPE, TIMED_PRODUCT_LAUNCH_TYPE]}
    />
  );
}

// 导出常量
export const ALL_TYPE: ITypeFilterOption = { text: '全部商品', value: 'ALL' };
export const NORMAL_TYPE: ITypeFilterOption = { text: '实物商品', value: 'NORMAL' };
export const VIRTUAL_TYPE: ITypeFilterOption = { text: '虚拟商品', value: 'VIRTUAL' };
export const ECARD_TYPE: ITypeFilterOption = { text: '电子卡券', value: 'ECARD' };
export const MEMBER_CARD_TYPE: ITypeFilterOption = { text: '付费会员卡', value: 'MEMBER_CARD' };
export const HOTEL_TYPE: ITypeFilterOption = { text: '酒店商品', value: 'HOTEL' };
export const PERIOD_BUY_TYPE: ITypeFilterOption = { text: '周期购商品', value: 'PERIOD_BUY' };
export const FEN_XIAO_TYPE: ITypeFilterOption = { text: '分销商品', value: 'FEN_XIAO' };
export const HAI_TAO_TYPE: ITypeFilterOption = { text: '海淘商品', value: 'HAI_TAO' };
export const BAKE_TYPE: ITypeFilterOption = { text: '蛋糕烘焙', value: 'BAKE' };
export const TIMED_PRODUCT_LAUNCH_TYPE: ITypeFilterOption = {
  text: '定时开售商品',
  value: 'TIMED_PRODUCT_LAUNCH',
};
export const KNOWLEDGE_TYPE: ITypeFilterOption = {
  text: '课程商品',
  value: 'KNOWLEDGE',
  relatedGroupOptions: [
    { text: '全部', value: 'ALL' },
    { text: '线下课', value: 'OFFLINE_COURSE' },
    { text: '专栏', value: 'COLUMN' },
    { text: '内容', value: 'CONTENT' },
    { text: '图文', value: 'contentText' },
    { text: '音频', value: 'contentAudio' },
    { text: '视频', value: 'contentVideo' },
    { text: '直播', value: 'LIVE' },
  ],
};
```
## 使用截图

![](https://b.yzcdn.cn/public_files/180d181fe4a8c636225795b44714753b.png)
