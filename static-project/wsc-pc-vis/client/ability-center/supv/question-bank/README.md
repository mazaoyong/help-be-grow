---
- title: 题库
- owner: 逐浪
- description: 题库对外提供的能力概览
- ref: client/pages/supv/question-bank
- tag:
    - 题库
    - 跳转
---

# 试题

## 一些类型定义

```typescript
import {
  QuestionType,
  QuestionLevel,
  /** 转化后的富文本数据格式 */
  IRichTextJSON,
  /** parsed字段中的格式 */
  IParagraph,
} from '@ability-center/supv/question-bank';
```

## 跳转编辑试题

```typescript
interface IBaseParams {
  type: 'edit' | 'create' | 'duplicate';
  // 分类id
  categoryId: number;
}
interface ICreatedParams extends IBaseParams {
  type: 'create';
}
interface IModifyParams extends IBaseParams {
  type: 'edit' | 'duplicate';
  questionId: number;
  questionName: string;
}
type IEditParams = IModifyParams | ICreatedParams;
import { getQuestionEditUrl } from '@ability-center/supv/question-bank';
```

## 编辑试题弹窗

```typescript
import { openEditQuestionContentDialog } from '@ability-center/supv/question-bank';
openEditQuestionContentDialog({ questionId });
```

## 打开分类列表弹窗 | 分类列表

```typescript
import {
  openMoveClassifyDialog,
  ClassifyList,
  /** 关于ClassifyList的数据类型定义 */
  IClassifyTree,
  IClassifyTreeItem,
  /** openMoveClassifyDialog 的第一个入参，通过它控制弹窗内容的表现 */
  IMoveClassifyProps,
  /** openMoveClassifyDialog的then回调函数的入参 */
  IMoveClassifyData,
} from '@ability-center/supv/question-bank';
```

### 分类列表

```tsx
<ClassifyLIst {...IMoveClassifyProps} />
```
### 分类列表弹窗

```typescript
openMoveClassifyDialog = (
  moveProps: IMoveClassifyProps,
  {
    ...EbizDialogOptions, // EbizDialog组件的属性设置，具体可以看ebiz-components文档
    submitEffect, // 可以选择在这里进行数据提交操作，会将Dialog的Button设置为loading状态,
                  // 直到它返回一个Promise<boolean>
  },
)
```