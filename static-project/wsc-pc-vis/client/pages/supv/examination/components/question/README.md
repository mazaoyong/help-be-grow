# 题目组件

## 说明

题目组件作为考试最基本的组件，会用到各个地方。有不同类型的题目组件，比如单选多选等等，也有不同场景下展示的题目，比如编辑分数，批阅展示，分析等等。
场景一般所展示的内容项是固定的，因此在`config.ts`中可进行展示配置，展示项包括：

```js
/** 是否显示工具栏 */
ShowToolBar?: boolean;
/** 是否显示分数*/
ShowScore?: boolean;
/** 是否显示分数规则 */
ShowRules?: boolean;
/** 分数是否可以编辑 */
ScoreEdit?: boolean;
/** 工具栏是否可编辑 */
ToolbarDisabled?: boolean;
/** 是否展示分数结果 */
ShowResult?: boolean;
/** 主观题分数是否可编辑 */
SubjectiveScoreEdit?: boolean;
/** 是否可折叠 */
Foldable?: boolean;
/** 是否展示正确率 */
ShowCorrectRate?: boolean;

/** 是否显示选项 */
ShowOptions?: boolean;
/** 是否显示答案 */
ShowAnswer?: boolean;
/** 是否显示学生答案 */
ShowStudentAnswer?: boolean;
/** 是否显示评论 */
ShowComment?: boolean;
/** 评论是否可以编辑 */
CommentEdit?: boolean;
/** 是否显示选择率 */
ShowChosenRate?: boolean;
/** 答案的label是否是固定宽度 */
AnswerLabelWidthFixed?: boolean;
```

## 使用

如果只是单个题目展示，直接使用`Question`
如果是题目列表且含有分数编辑等情况时，使用`MemorizedQuestion`更有利于性能

题目组件具体传参见types定义，注意题目组件是受控组件，分数、评分等均由外部传入，计算规则等也均在外部

## 题目分数计算逻辑

1.填空题 只填每空的分数A  总分 = A * 空的个数
2.多选项先输入总分，如果是按选项记分，那么每分限制是总分再除正确选项个数；如果是按少选得分，那么每分限制输入最大是总分


## Changelog

2020-06-30

当配置了可折叠时，可点击区域修改为组件的整个头部
