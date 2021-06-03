---
- title: 请好友看表单
- owner:
  - 埃里克
- description: 请好友看表单
- cover: https://b.yzcdn.cn/plus/one/second/image-20191104190413578.png
- tag:
  - 请好友看
  - 自定义表单域
---

## InvietFriendForm 请好友看表单

导入路径 `client/pages/pct/common/components/invite-friend`

#### InviteFriendField 请好友看表单域

该组件包括一个可单独导入使用的子组件 ，它的导入路径为`client/pages/pct/common/components/invite-friend/Field.jsx`，下文中会介绍二者的区别。

### 适用场景

该组件用作开启专栏的「请好友看」功能，该组件可以单独作为完整的表单使用，也可以把子组件 InviteFriendField 当作表单域用在其他表单中。

完整导入该组件主要用在：

- [课程/在线课程/专栏/列表页/操作栏-更多-开启请好友看](https://www.youzan.com/v4/vis/pct/page/column#/list)
- [课程/在线课程/专栏/内容管理页/右上角菜单-开启请好友看](https://www.youzan.com/v4/vis/pct/page/column#/list)

导入子组件  「InviteFriendField 请好友看表单域」时，用在：

- [课程/在线课程/专栏/新建（编辑）专栏页](https://www.youzan.com/v4/vis/pct/page/column#/add)

该组件是一个 `Form` 组件，包括：

- 一行文案「开启后，订购用户可分享内容给好友免费看，吸引好友购买专栏」
-  InviteFriendField 请好友看表单域
  -  一行输入框 ——「单篇内容可支持『 』位好友领取」，紧随一个提示文案
  -  一行输入框——「同一好友可领取『 』篇内容」，紧随一个提示文案
- 一个「确定」按钮，点击后会触发给定的回调函数
- 一个「关闭」按钮，点击后会触发给定的回调函数



### 使用指南

使用该组件时，因为是一个 `Form`组件，根据[文档](https://zent-contrib.github.io/zent-compat/zh/component/form#biao-dan-form)：

> 使用 `Form` 组件，必须先调用 `createForm` 方法包装，为表单注入 `zentForm` 属性，从而提供表单和表单元素的各种操作方法。

参见下文中的代码演示。

当导入子组件使用时，不必考虑这个问题。

### 代码演示

#### 导入整个组件

导入表单组件如图所示，注意，该组件仅包括图中框出来的部分

![image-20191104190413578](https://b.yzcdn.cn/plus/one/second/image-20191104190413578.png)

```jsx
import InvietFriend from '../../../common/components/invite-friend';

const WrappedForm = createForm({ scrollToError: true })(InvietFriend);
openDialog({
  dialogId: DIALOG_ID,
  title: '开启请好友看',
  children: (
    <WrappedForm
      closeClick={() => closeDialog(DIALOG_ID)}
      submitForm={formVal => this.inviteFriend(alias, isShared, formVal)}
    />
  ),
  className: 'dialog-535',
});
```

#### 单独导入表单域组件

同样的，只包括图中框出来的部分

![image-20191104193149154](https://b.yzcdn.cn/plus/one/second/image-20191104193149154.png)

```javascript
// file: client/pages/pct/column/containers/edit/index.jsx

import InviteFriendField from '../../../common/components/invite-friend/Field';

<Field
  name="is_shared"
  label="请好友看："
  component={CheckboxField}
  value={!!isShared}
  onChange={this.onCheckboxChange}
  helpDesc={
    isShared ? '当专栏为0元，或专栏中的内容允许免费试看时，买家端不显示请好友看入口' : ''
  }
>
  订购用户将专栏部分内容免费请好友看
</Field>
{isShared ? (
  <div className="invite-friend-field">
    <InviteFriendField
      every_content_friend_count={everyContentFriendCount}
      every_friend_content_count={everyFriendContentCount}
    />
  </div>
) : null}
```



### API

#### InvietFriendForm 请好友看表单

| 参数       | 说明                           | 类型                      | 默认值 | 是否必填 |
| :--------- | :----------------------------- | :------------------------ | :----- | :------- |
| submitForm | 点击「确定」按钮触发的回调函数 | `Function(value: Object)` | 无     | 是       |
| closeClick | 点击「关闭」按钮触发的回调函数 | `Function`                | 无     | 是       |

其中 `submitForm` 回调接受的参数结构如下：

```javascript
let value = {
  every_friend_content_count: 10, // 单篇内容可支持几位好友领取
  every_content_friend_count: 10 // 同一好友可领取几篇内容
}
```

#### 子组件 -InviteFriendField 请好友看表单域

| 参数                       | 说明                                       | 类型     | 默认值      | 是否必填 |
| :------------------------- | :----------------------------------------- | :------- | :---------- | :------- |
| every_content_friend_count | 用作表单初始值，单篇内容可支持几位好友领取 | `Number` | `undefined` | 否       |
| every_friend_content_count | 用作表单初始值，同一好友可领取几篇内容     | `Number` | `undefined` | 否       |

### ChangeLog
- 2020-02-06 修改field的样式，与标题对齐 - gaotian