---
- title: 直播课程操作菜单
- owner:
  - 埃里克
- description: 直播课程操作菜单
- cover: https://b.yzcdn.cn/plus/one/second/image-20191105134353002.png
- tag:
  - 表格操作
  - 操作菜单
  - 直播课程
---

##  ActionMenu 直播课程操作菜单（作为item-menu的替代）

导入路径` client/pages/course/common/components/live/action-menu`

### 适用场景

该组件用作在直播课程列表的「操作」列单元格中的操作菜单，如：

- [课程/在线课程/直播/列表页](https://www.youzan.com/v4/vis/pct/page/live#/list)

- [课程/在线课程/专栏/内容管理页/列表](https://www.youzan.com/v4/vis/pct/page/column#/content/360h6nham5u2f)

该组件包括 8 个文字按钮（并非全部显示）

顶层有 3 - 4 个按钮，点击更多会展开其他按钮：

- 「免费试看/取消试看 」按钮 （仅在专栏内容管理列表中显示）——点击设置免费试看/取消试看
- 「讲师设置按钮」——点击打开[「设置直播间管理员」弹窗](../teacher-dialog)
- 「推广」按钮——点击打开[「推广课程」弹窗](../../../../../components/promotion)
- 「更多」按钮——点击展开其他按钮
  - 「删除」按钮——点击打开「删除确认」弹窗*****
  - 「编辑」按钮——点击跳转编辑页面*****
  - 「隐藏/显示」按钮（仅连锁店铺）——点击设置课程隐藏/显示*****
  - 「结束直播」按钮（仅直播进行中显示）——点击打开「结束直播」确认弹窗*****
  - 「信息设置」按钮——点击打开「直播信息设置」弹窗*****

注：标注 * 号的弹窗或者逻辑都是由传入的回调函数完成的，详见[API](#api)一节。

### 使用指南

该组件应当作为 [「Zent Grid-Column 组件」](http://fedoc.qima-inc.com/zent-beta/zh/component/grid#columns)的 `bodyRender` prop 中使用。

该组件依赖于推广组件，应该先阅读一下其[文档](../../../../../components/promotion)。

### 代码演示

在直播项目列表中显示：

![image-20191105134353002](https://b.yzcdn.cn/plus/one/second/image-20191105134353002.png)



在专栏内容列表中显示：

![image-20191105135027090](https://b.yzcdn.cn/plus/one/second/image-20191105135027090.png)

```jsx
// file: client/pages/course/live/containers/list/list.tsx

import LiveItem from '../../../common/components/live/action-menu';

let columns = [
      {
        title: '操作',
        width: '20%',
        bodyRender: item => (
          <ActionMenu
            item={item}
            hideBdapp={hideBdapp}
            reload={updateList}
          />
        ),
      },
 ]

```

### API

| 参数      | 说明                                             | 类型            | 默认值  | 是否必填 |
| :-------  | :----------------------------------------------- | :-------------- | :------ | :------- |
| Item      | 直播信息对象                                     | `Object`        | 无      | 是       |
| isColumn  | 是否在专栏内容管理页（「免费试看」按钮是否显示） | `Boolean`       | `fasle` | 否       |
| hideBdapp | 是否隐藏百度小程序，透传给推广组件               | `Boolean`       | `fasle` | 否       |
| reaload   | 刷新列表页方法                                | `Function`       | 无 | 是       |

### changelog
- 20200304 默认保利威直播，视频直播屏蔽百度小程序
