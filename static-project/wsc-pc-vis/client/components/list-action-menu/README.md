---
- title: ListActionMenu 直播课程操作菜单
- owner:
  - 埃里克
- description: ListActionMenu 直播课程操作菜单
- cover: https://b.yzcdn.cn/plus/one/second/image-20191105134353002.png
- tag:
  - ListActionMenu
  - 直播课程
  - 操作菜单
---

##  ListActionMenu 直播课程操作菜单

导入路径` client/pages/components/list-action-menu`

### 适用场景

该组件用作在列表的「操作」列单元格中的操作菜单，如：

- [课程/在线课程/直播/列表页](https://www.youzan.com/v4/vis/pct/page/live#/list)

该组件包括3种文字按钮

- 「普通」按钮 （自定义设置按钮内容和点击事件）
- 「更多」按钮——点击展开其他按钮（通过配置指定其他按钮的数量、文字、点击事件）

### 使用指南

该组件应当作为 [「Zent Grid-Column 组件」](http://fedoc.qima-inc.com/zent-beta/zh/component/grid#columns)的 `bodyRender` prop 中使用。

### 代码演示

在直播项目列表中显示：

![image-20191105134353002](https://b.yzcdn.cn/plus/one/second/image-20191105134353002.png)

```jsx
// file: client/pages/couse/components/live/action-menu/index.tsx

  <ListActionMenu
    config={[{
      title: '前往直播',
      onClick: onPolyvShare,
      showLock: true,
      isLock,
      show: isPolyv,
    }, {
      title: '讲师设置',
      onClick: () => showTeacherQrcode(info),
      showLock: true,
      isLock,
      show: !isPolyv,
    }, {
      title: (
        <Promotion
          data={{
            url: item.live_detail_url,
            alias: item.alias,
            name: item.title,
            pagepath: 'packages/paidcontent/live/index',
            webviewPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(`http://h5.youzan.com/v2/ump/paidcontent?alias=${alias}&page=livedetail&sg=live&kdt_id=${window._global.kdtId || 0}`)}`,
            hideBdapp: hideBdapp,
          }}
          hideWeapp={isPolyv}
        >
          <LockWrap lockType={LockType.PCT_GOODS} isLock={isLock} className="ui-link--split">
            推广
          </LockWrap>
        </Promotion>
      ),
    }, {
      title: '删除',
      onClick: triggerDeleteLive,
    }, {
      title: '编辑',
      onClick: linkToEdit,
    }, {
      title: SHOW_IN_STORE[1 - item.show_in_store],
      onClick: hideLive,
      show: !isPolyv && isEduChain,
    }, {
      title: '结束直播',
      onClick: finishLive,
      show: !isPolyv && item.live_status !== 3,
    }, {
      title: '管理直播频道',
      onClick: goPolyManage,
      show: isPolyv,
    }, {
      title: '信息设置',
      onClick: setLive,
      show: !isPolyv,
      showLock: true,
      isLock,
    }]}
  />

```

### config配置项

| 参数      | 说明                                             | 类型            | 默认值  | 是否必填 |
| :-------- | :---------------------------------------------  | :-------------- | :------ | :------- |
| title     | 按钮文字                                     | `String | ReactElement`| 无      | 是       |
| showLock  | 是否展示风控锁，依赖lock-wrap                  | `Boolean`       | `false` | 否       |
| lockType  | 风控锁类型，依赖lock-wrap                     | `String`       | `false` | 否       |
| isLock    | 是否锁定                                     | `Boolean`       | `fasle` | 否       |
| show      | 是否展示                                     | `Boolean`       | `true` | 否       |
| onClick   | 按钮点击事件                                  | `Function`      | 无      | 是       |
| disbaled  | 是否禁止点击                                  | `Boolean`       | `false` | 否       |

### Changelog
- 2020-04-27
  - 删除`inMore`属性，内部使用`RC Operations`实现
