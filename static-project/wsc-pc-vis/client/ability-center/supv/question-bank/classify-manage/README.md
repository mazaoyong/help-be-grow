---
- title: 题库
- owner: 逐浪
- description: 关于题库分类列表的相关组件和方法都在这里
- ref: client/pages/supv/question-bank/classify-manage
- tag:
    - 题目分类列表
    - 树形展示题目分类列表
---

# 分类列表

> 展示题目分类列表

```jsx
import { ClassifyList } from '@ability-center/supv/question-bank';

const Comp = () => {
  return (
    <ClassifyList />
  )
}
```

## API

```typescript
interface IClassifyListProps {
   /** 是否显示标题，默认不显示 */
  withHeader?: boolean;
  /** 是否显示操作，默认不显示 */
  showOperators?: boolean;
  /** 是否显示题目统计，默认显示 */
  showQuestionCount?: boolean;
  onDataChange?(categoryData: IClassifyTree): void;
  /** 点击某个分类的回调 */
  onClickItem?(targetId: number, rowData: IClassifyTreeItem): void;
  className?: string;
  /** 弹出的气泡的位置 */
  popPosition?: PopPositions;
  style?: React.CSSProperties;
  /** 剔除不显示的子节点 */
  omitChild?: IClassifyTreeItem['depPointer'];
}
```

# 移动分类列表

> 展示分类列表，点击之后触发移动列表的操作

```typescript
import {
  openMoveClassifyDialog,
  MoveClassifyProps,
  IMoveClassifyData,
} from '@ability-center/supv/question-bank';
// openMoveClassifyDialog: 移动分类的弹窗

export interface IMoveClassifyProps {
  // 深度信息，用于标记移除这个层级的数据
  depPointer: IClassifyTreeItem['depPointer'];
  // 选中了目标节点后触发
  onSelect?(targetId: number, rowData?: IClassifyTreeItem): void;
}

openMoveClassifyDialog = (
  moveProps: IMoveClassifyProps,
  submitEffect?: IDialogSubmitEffect<IMoveClassifyData>,
) => void;
```

## submitEffect 提交的副作用函数

`submitEffect`会在点击确认按钮的时候触发，一般用于想要在关闭`Dialog`前进行接口的提交操作，并且如果提交过程失败，就不关闭`Dialog`

### 类型定义

```typescript
type IDialogSubmitEffect<T = any> = (data: T) => Promise<boolean>;
```

### 使用例子

```typescript
(data: T) => {
  return fetch(query)
    .then((success) => {
      if (success) Notify.success('移动分类成功');
      else Notify.error('网络异常，请稍后重试');
      return success;
    })
    .catch((err) => {
      err && Notify.error(err);
      return false;
    });
}
```
