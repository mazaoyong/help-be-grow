---
- title: 加分推广表单
- owner:
  - 埃里克
- description: 加分推广表单模块
- cover: https://b.yzcdn.cn/plus/one/second/image-20191104204410756.png
- tag:
  - 加分推广
  - 表单
---

## joinGroupSetting 加粉推广表单模块

导入路径 `client/pages/pct/common/components/join-group-setting`

### 适用场景

该组件用作在线课程创建/编辑表单中的「加粉推广」部分，用来设置加粉推广相关功能，如：

- [课程/在线课程/内容/新建（编辑）内容页](https://www.youzan.com/v4/vis/pct/page/content#/add/text)

- [课程/在线课程/专栏/新建（编辑）专栏页](https://www.youzan.com/v4/vis/pct/page/column#/add)

- [课程/在线课程/直播/新建（编辑）直播页](https://www.youzan.com/v4/vis/pct/page/live#/add)

该组件包括：

- 一个复选框，表示是否开启，当不勾选时，仅显示这个复选框，当勾选时：
  - [推广码设置模块 ](../qr-code-setting)
  - [其他二维码设置模块](../qr-code-setting-text)

这两个模块请移步各自的文档。

### 使用指南

该组件是一个 [FormSection 组件](https://zent-contrib.github.io/zent-compat/zh/component/form#formsection-zu-jian)，请先阅读相关文档。

### 代码演示

![image-20191104204410756](https://b.yzcdn.cn/plus/one/second/image-20191104204410756.png)



```jsx
// file: client/pages/pct/content/EditPage.jsx

import JoinGroupSetting from '../common/components/join-group-setting';

this.state = {

joinGroupSetting: {
    groupOpen: 0, // 是否开启加粉推广
	  guideCopy: '', // 课程详情页引导文案
    groupPicture: '', // 推广码图片地址（若选择了固定二维码）
    qrCodeGuideText: '',  // 二维码引导文案
    liveCode: { // 推广码信息（若选择了活码）
      codeId: '',
      codeName: '',
      codeKdtId: '',
      codePicture: '',
    },
    courseDetailPageOpen: 0, // 在课程详情页展示
    popupAfterPurchasingOpen: 1, // 购买后弹窗展示
    codeType: CODE_TYPE.LIVE_CODE, // 推广码类型
 },

}

handleSetJoinGroup = joinGroupSetting => this.setState({ joinGroupSetting });

<JoinGroupSetting
  joinGroupSetting={state.joinGroupSetting}
  handleSetJoinGroup={this.handleSetJoinGroup}
/>

```



### API



| 参数               | 说明                                       | 类型                     | 默认值 | 是否必填 |
| :----------------- | :----------------------------------------- | :----------------------- | :----- | :------- |
| joinGroupSetting   | 表示加群设置的对象                         | `Object`                 | 无     | 是       |
| handleSetJoinGroup | 当组件内表单域的值发生变化时触发的回调函数 | `Function(value:Object)` | 无     | 是       |



`joinGroupSetting` 与 `handleSetJoinGroup`回调接受的参数结构是相同的，具体字段请看[代码演示](#代码演示)一节的注释。

