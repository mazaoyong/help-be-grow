---
- title: 参加会员折扣自定义表单域
- owner:
  - 埃里克
- description: 参加会员折扣自定义表单域
- cover: https://b.yzcdn.cn/plus/one/second/image-20191104172858346.png
- tag:
  - 会员折扣
  - 自定义表单域
---

## VipCardField 参加会员折扣自定义表单域

导入路径 ` client/pages/pct/common/components/field/vip-card-field`

### 适用场景

该组件用作在线课程创建/编辑表单中的「参加会员折扣」部分，用来设置在线课程是否参加会员折扣，如：

- [课程/在线课程/内容/新建（编辑）内容页](https://www.youzan.com/v4/vis/pct/page/content#/add/text)

- [课程/在线课程/专栏/新建（编辑）专栏页](https://www.youzan.com/v4/vis/pct/page/column#/add)

- [课程/在线课程/直播/新建（编辑）直播页](https://www.youzan.com/v4/vis/pct/page/live#/add)

该组件包括：

- 一个复选框——表示是否开启归属会员权益
- 一个文字链接「配置会员折扣」，点击跳转到[权益卡管理](https://www.youzan.com/v4/scrm/membercard#/)页

### 使用指南

该组件是[「使用 `getControlGroup` 封装的自定义表单域」](https://zent-contrib.github.io/zent-compat/zh/component/form#shi-yong-getcontrolgroup-feng-zhuang-zi-ding-yi-biao-dan-yu)，应当作为[「表单域  Filed」](https://zent-contrib.github.io/zent-compat/zh/component/form#biao-dan-yu-field) 组件的 `component` props 使用。

见[「API」一节](#api)。

### 代码演示

![image-20191104172858346](https://b.yzcdn.cn/plus/one/second/image-20191104172858346.png)



```jsx
// file: client/pages/pct/content/EditPage.jsx

import VipCardField from '../common/components/field/vip-card-field';

<Field
  name="join_level_discount"
  label="会员："
  component={VipCardField}
  value={this.state.join_level_discount}
  self={this}
  sellTypeData={this.state.sellTypeData}
  validations={{
    validData(values, value) {
      if (
        value &&
        !(
          values.sellTypeData &&
          values.sellTypeData.isSingleChecked &&
          (values.sellTypeData.price === 0 || values.sellTypeData.price)
        )
      ) {
        return '只有单篇销售的内容才可以享受会员折扣';
      }
      return true;
    },
  }}
/>
```



### API

该组件接受`Filed`封装过的的 props，请参考[`Form`组件原理](https://zent-contrib.github.io/zent-compat/zh/component/form#zu-jian-yuan-li)  和 [`From.Fileld` 的 API 文档](https://zent-contrib.github.io/zent-compat/zh/component/form#form-field)。

此外，它还接受一个 prop：

| 参数 | 说明                       | 类型     | 默认值 | 是否必填 |
| :--- | :------------------------- | :------- | :----- | :------- |
| self | 指向一个组件，具体说明见下 | `Object` | 无     | 是       |

使用该组件时，不必使用 `onChange` 回调，它接受一个 `self` prop ，在内部调用了 `self` 指向的组件的 `setState`更新 `state.join_level_discount`。

内部实现如下：

```javascript
  onChange = e => {
    const val = e.target.checked;
    this.props.onChange(val);
    this.props.self.setState({
      join_level_discount: val,
    });
  };

```

该组件接受的 `value` 格式为一个布尔值。
