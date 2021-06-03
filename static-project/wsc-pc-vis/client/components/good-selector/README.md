---
- title: Good Selector 知识付费商品选择组件
- owner:
    - 埃里克
- description: Good Selector 知识付费商品选择组件
- cover: https://b.yzcdn.cn/public_files/e8562adc8f3d22a9c21056cc5542e77e.png
- tag:
    - Good Selector 
    - 知识付费
    - 商品选择
---

# Good Selector 知识付费商品选择组件

### 适用场景
知识付费商品的商品选择。

部分字段结构跟 zan-ui 提供的 goods-selector 类似。
见：http://fedoc.qima-inc.com/react-components/#/goods-selector

### 使用示例
* 好友助力-商品设置-添加知识商品(client/pages/pct/boost/components/GoodsSelectField.jsx)


### 使用截图
![](https://b.yzcdn.cn/public_files/e8562adc8f3d22a9c21056cc5542e77e.png)

### 使用说明

#### API

name | 说明  | 默认值
-|-|-
isOnlyEdu | 开启后 type 只显示知识商品 | true
hasFx | 开启后 频道会显示分销 | false
eduDetailGroup | 开启后知识商品的 groups 会显示 专栏、（图文、视频、音频）、直播<br>ps: 图文、视频、音频 同属于 内容类型<br>不开启会显示 专栏、内容、直播 | false
ignoreGroup | 对应 id：<br>1 => 专栏<br>2 => 图文<br>4 => 直播<br>10 => 教育<br>对不同频道下的知识商品 groups 筛选：<br>{<br>&nbsp;&nbsp;online: {<br>&nbsp;&nbsp;&nbsp;&nbsp;value: [4]<br>&nbsp;&nbsp;},<br>}<br><br>这种情况会展示 专栏、图文，去掉了直播 | {}
activityType | 活动 type | -
activityId | 当前活动的 id 可选 | 0
hasSku | 某些场景需要选择商品的 sku<br>往 selected 数据中设置 sku 信息：<br>data.skuInfo = {<br>&nbsp;&nbsp;id: data.skuId,<br>&nbsp;&nbsp;value: data.skuValue,<br>};<br><br>已选中的数据中取 sku 信息方式<br><br>const skuInfo = data.skuInfo;<br> | -
singleSkuMode | 是否支持 sku 单选 | true
singleMode | 是否是单选模式 | false
selected | {<br>&nbsp;&nbsp;distribution: {<br>&nbsp;&nbsp;&nbsp;&nbsp;type: 'part',<br>&nbsp;&nbsp;&nbsp;&nbsp;value: [],<br>&nbsp;&nbsp;},<br>&nbsp;&nbsp;offline: {<br>&nbsp;&nbsp;&nbsp;&nbsp;type: 'part',<br>&nbsp;&nbsp;&nbsp;&nbsp;value: [],<br>&nbsp;&nbsp;},<br>&nbsp;&nbsp;online: {<br>&nbsp;&nbsp;&nbsp;&nbsp;type: 'part',<br>&nbsp;&nbsp;&nbsp;&nbsp;value: [],<br>&nbsp;&nbsp;},<br>}<br><br>参见 http://fedoc.qima-inc.com/react-components/#/goods-selector #customize 属性说明 | -
maxSelectedNum | 选择数据的数量限制 | -
column | 自定义表格数据，若传了，会替代组件内表格的列，参见 zent | []
btnTxt | 按钮的文字 | '' 
dialogClassName | 弹框样式 | ''
className | 按钮样式 | ''
disabled | 是否不可以使用商品选择组件 | false
onChange | 选择后的商品列表输出 | -
shouldSelect | 不可选行的设置：一个函数，定义哪些行能展示 参见 zent table 的 getRowConf | -
shouldSelectSku | 不可选择 sku 的设置 参照 shouldSelect | -
channels | 完全自定义频道，一般用不到 | []
customize | 完全重新定义组件，如果用到这个，代表你可能不需要用这个组件了。。 | {}
ext | 教育商品附加字段 | -

# 注意事项

# CHANGELOG

2020-3-23 针对知识付费商品，库存应该显示不限库存
