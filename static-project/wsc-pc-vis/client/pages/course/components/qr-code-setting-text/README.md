## QRCodeSettingText 加粉推广其他设置模块

导入路径 ` client/pages/pct/common/components/qr-code-setting-text`

### 适用场景

该组件用作在线课程创建/编辑表单中的「加粉推广」部分的其他设置模块，用来设置加分推广的其他选项，目前仅用在[joinGroupSetting 加粉推广表单模块](../join-group-setting)中。

其他选项包括：

- 二维码引导文案
- 是否开启购买后弹窗展示
- 是否开启在课程详情页展示
- 课程详情页引导文案

使用示例与 [joinGroupSetting 加粉推广表单模块](../join-group-setting) 相同，请移步查看。

### 使用指南

该组件是几个表单域的结合，可以作为表单的一部分使用。

### 代码演示

![image-20191105164032761](https://img.yzcdn.cn/upload_files/2020/08/20/Fv7x4fywlQJ0YTLpG5uMB1e2jZTF.png)

```jsx
// file: client/pages/pct/common/components/join-group-setting/index.jsx

import QRCodeSettingText from '../qr-code-setting-text';

<QRCodeSettingText
  joinGroupSetting={joinGroupSetting}
  handleCourseDetialChange={this.handleCourseDetialChange}
  handleGroupModalChange={this.handleGroupModalChange}
/>
```



### API

| 参数                     | 说明                                                         | 类型                     | 默认值 | 是否必填 |
| :----------------------- | :----------------------------------------------------------- | :----------------------- | :----- | :------- |
| joinGroupSetting         | 表示加群设置的对象                                           | `Object`                 | 无     | 是       |
| handleCourseDetialChange | 当「在课程详情页展示」选项发生变化时触发的回调函数，可以使用`event.target.checked`来判断是否选中 | `Function(event:Object)` | 无     | 是       |
| handleGroupModalChange   | 当「购买后弹窗展示」选项发生变化时触发的回调函数，可以使用`event.target.checked`来判断是否选中 | `Function(event:Object)` | 无     | 是       |

`joinGroupSetting`的具体字段参见[ 加粉推广表单模块 API](../join-group-setting#api)。



备注：

「二维码引导文案」 对应 `joinGroupSetting.qrCodeGuideText`

「课程详情页引导文案」 对应 `joinGroupSetting.guideCopy`






