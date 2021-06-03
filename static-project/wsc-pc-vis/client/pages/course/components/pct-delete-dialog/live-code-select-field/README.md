## LiveCodeSelectField 活码选择自定义表单域

导入路径 `client/pages/pct/common/components/live-code-select-field`

### 适用场景

该组件用作在线课程创建/编辑表单中的「加粉推广」部分的「推广码设置模块」的选择活码功能，用来选择活码，参见[QRCodeSetting 推广码设置模块](../qr-code-setting)。

此外，还用在这里：

- [应用中心/ 督学互动/扫码签到/签到码设置](https://www.youzan.com/v4/vis/edu/page/signin#/edit)

该组件包括：

- 一个文字按钮「选择活码」
  - 点击后打开选择活码弹窗
  - 选择的活码会以标签的样式显示

### 使用指南

该组件是[「使用 `getControlGroup` 封装的自定义表单域」](https://zent-contrib.github.io/zent-compat/zh/component/form#shi-yong-getcontrolgroup-feng-zhuang-zi-ding-yi-biao-dan-yu)，应当作为[「表单域  Filed」](https://zent-contrib.github.io/zent-compat/zh/component/form#biao-dan-yu-field) 组件的 `component` props 使用。

见[「API」一节](#api)。

### 代码演示

该组件仅包括框出来的部分：

![image-20191105170234262](https://b.yzcdn.cn/plus/one/second/image-20191105170234262.png)

点击按钮后弹出的选择活码弹窗：

![image-20191105170326829](https://b.yzcdn.cn/plus/one/second/image-20191105170326829.png)



```jsx
// file: client/pages/edu/signin/containers/edit/form.jsxprop

import LiveCodeSelectField from '../../components/live-code-select-field';

<Field
  name="liveCode"
  value={liveCode}
  label="活码:"
  component={LiveCodeSelectField}
  required
  asyncValidation={(values, value) => {
    if (!value || !value.codeId) {
      return Promise.reject('请选择活码');
    }
    return Promise.resolve();
  }}
/>

```



### API

该组件接受`Filed`封装过的的 props，请参考[`Form`组件原理](https://zent-contrib.github.io/zent-compat/zh/component/form#zu-jian-yuan-li)  和 [`From.Fileld` 的 API 文档](https://zent-contrib.github.io/zent-compat/zh/component/form#form-field)。

它接受的 `value` 与调用回调函数传入的参数为下面的对象：

```javascript
// 不选时是空对象
{}

// 
{
    codeName: 'name',
    codeId: 'id',
    codePicture: 'url',
    codeKdtId: 'sourceKdtId',
}
```