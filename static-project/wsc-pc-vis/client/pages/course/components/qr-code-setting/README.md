## QRCodeSetting 推广码设置模块

导入路径 ` client/pages/pct/common/components/qr-code-setting`

### 适用场景

该组件用作在线课程创建/编辑表单中的「加粉推广」部分的推广码设置模块，用来设置推广码信息，目前仅用在[joinGroupSetting 加粉推广表单模块](../join-group-setting)中。


该组件包括：

- 一个单选框组，lable 为「推广码类型」，选项有「活码」、「固定二维码」
- 当选择活码时：
  - 一个文字按钮「选择活码」，点击打开[「选择活码对话框」](../live-code-select-field)
- 当选择固定二维码时：
  - 一个上传二维码输入框  

使用示例与 [joinGroupSetting 加粉推广表单模块](../join-group-setting) 相同，请移步查看。


### 使用指南

该组件是几个表单域的结合，可以作为表单的一部分使用。

### 代码演示

![image-20191105163139462](https://b.yzcdn.cn/plus/one/second/image-20191105163139462.png)


![image-20191105161500353](https://b.yzcdn.cn/plus/one/second/image-20191105161500353.png)


```jsx
// file: client/pages/pct/common/components/join-group-setting/index.jsx

import QRCodeSetting from '../qr-code-setting';

<QRCodeSetting
  joinGroupSetting={joinGroupSetting}
  handleCodeTypeChange={this.handleCodeTypeChange}
  handleSetLiveCode={this.handleSetLiveCode}
/>
```



### API

| 参数                 | 说明                                                         | 类型                     | 默认值 | 是否必填 |
| :------------------- | :----------------------------------------------------------- | :----------------------- | :----- | :------- |
| joinGroupSetting     | 表示加群设置的对象                                           | `Object`                 | 无     | 是       |
| handleCodeTypeChange | 当选择的推广码类型发生变化时触发的回调函数，可以使用`event.target.value`获取 | `Function(event:Object)` | 无     | 是       |
| handleSetLiveCode    | 当选择的活码发生变化时触发的回调，参数对象是活码的信息       | `Function(value:Object)` | 无     | 是       |

`joinGroupSetting`的具体字段参见[ 加粉推广表单模块 API](../join-group-setting#api)。

备注：

若选择固定二维码，则选择的图片 URL  对应 `joinGroupSetting.groupPicture`。



