---
- title: 节假日列表组件
- owner:
  - 戴勇
- description: 设置-教务设置-节假日设置展示节假日列表、新建排课-选择自定义节假日弹窗中展示节假日列表
- cover: https://b.yzcdn.cn/public_files/3a4d23d8f38934916358245ca81d145d.png
- tag:
  - 预约
  - page
  - 节假日
---

# 节假日列表组件
## demo
```jsx
```
## api
| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
|        |                     |                                                      |         |                     |

## 使用场景
设置-教务设置-节假日设置展示节假日列表  
新建排课-选择自定义节假日弹窗中展示节假日列表

## props
```typescript
interface HolidayListProps {
  // 类型：节假日设置页｜排课选择节假日弹窗
  type: 'setting' | 'select';
  // 点击新建节假日
  onCreate?: () => void;
  // 点击编辑节假日，只在setting页需要
  onModify?: (item: any) => void;
  // 点击删除节假日，只在setting页需要
  onDelete?: (id: string) => void;
  // 选中的节假日，只在选择节假日弹窗中需要
  selected?: string[];
  // 选择节假日回调
  onSelect?: () => void;
  // 用于外部强制组件更新数据，FC组件可以用useRef，class组件可以用函数的方式获取
  refetcherRef?: React.MutableRefObject<any> | ((ref: () => void) => void);
  // 只查询指定校区+总部节假日
  queryKdtId?: number;
  // 每页展示条数，默认20
  pageSize?: number;
}
```

## ChangeLog
- `2020-02-03` 改动内容
- `2020-02-04`
  - 改动内容1
  - 改动内容2

