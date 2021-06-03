---
- title: 会员权益自定义表单域
- owner:
  - 埃里克
- description: 归属会员权益的自定义表单域
- cover: https://b.yzcdn.cn/plus/one/second/image-20191104161325954.png
- tag:
  - 归属会员权益
  - 自定义表单域
---


## VipBenefitField 归属会员权益自定义表单域

导入路径 `client/pages/pct/common/components/field/vip-benefit`

### 适用场景

该组件用作在线课程创建/编辑表单中的「归属会员权益」部分，用来设置在线课程的归属会员权益，如：

- [课程/在线课程/内容/新建（编辑）内容页](https://www.youzan.com/v4/vis/pct/page/content#/add/text)

- [课程/在线课程/专栏/新建（编辑）专栏页](https://www.youzan.com/v4/vis/pct/page/column#/add)

- [课程/在线课程/直播/新建（编辑）直播页](https://www.youzan.com/v4/vis/pct/page/live#/add)

该组件包括：

- 一个复选框——表示是否开启归属会员权益
- 一个文字按钮「添加会员权益」，点击会打开选择会员权益对话框
- 复选框下面是当前选择的会员权益的标签列表

注意：弹出的会员权益对话框依赖于[选择会员权益](../../benefit-choose)

### 使用指南

该组件是[「使用 `getControlGroup` 封装的自定义表单域」](https://zent-contrib.github.io/zent-compat/zh/component/form#shi-yong-getcontrolgroup-feng-zhuang-zi-ding-yi-biao-dan-yu)，应当作为[「表单域  Filed」](https://zent-contrib.github.io/zent-compat/zh/component/form#biao-dan-yu-field) 组件的 `component` props 使用。

见[「API」一节](#api)。

### 代码演示

如图，该组件表现为一个复选框，当前选择的会员权益会以标签的形式显示在下方：

![image-20191104161325954](https://b.yzcdn.cn/plus/one/second/image-20191104161325954.png)

当点击「添加会员权益」按钮时，会弹出选择权益对话框，选择某个权益后点击确定，对话框将关闭，所选的权益会显示在下方：

![image-20191104161522640](https://b.yzcdn.cn/plus/one/second/image-20191104161522640.png)



```jsx
// file: client/pages/pct/content/EditPage.jsx

import VipBenefitField from '../common/components/field/vip-benefit';

<Field
  name="benefitData"
  label=""
  component={VipBenefitField}
  value={this.state.benefitData}
  self={this}
  helpDesc="作为单篇销售的内容可以加入会员权益"
  sellTypeData={this.state.sellTypeData}
  validations={{
    validData(_, value) {
      if (value.isIn && value.list.length === 0) {
        return '请至少选择1个会员权益';
      } else if (!value.isIn && value.list.length > 0) {
        return '请勾选归属会员权益，或删除现有会员权益';
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

使用该组件时，不必使用 `onChange` 回调，它接受一个 `self` prop ，在内部调用了 `self` 指向的组件的 `setState`更新 `state.benefitData`。

内部实现如下：

```javascript
onCheckedChange = e => {
  const data = {
    isIn: e.target.checked,
    list: this.props.value.list,
  };
  this.props.onChange(data);
  // here
  this.props.self.setState({
    benefitData: data,
  });
};

```



该组件接受的 `value` 格式为：



```js

{
  isIn:false, // 是否开启
  list:[] // 开启的权益列表
}

```

