import {
  QuestionType,
  QuestionLevel,
  IMoveClassifyProps,
} from '@ability-center/supv/question-bank';

export interface IQuestionBankListDataType {
  categoryId: number; // 题目关联的直属分类id
  categoryName: string;
  id: number; // 试题id
  level: QuestionLevel; // 试题难度：(1,简单), (2,普通), (3,较难)
  score: number; // 试题分数，精确到小数点后两位，实际页面展示时，需要除以100
  status: number; // 试题状态 0:删除 1:未删除
  title: string; // 试题标题（富文本字段)
  type: QuestionType; // 试题类型：(1,单选题),(2,多选题),(3,判断题),(4,填空题),(5,简答题)
}

export interface IMoveQuestionProps extends IMoveClassifyProps {
  moveIds: number[];
}
export type IDeleteQuestionsFunc = (deleteIds: Array<number | string>) => void;
export type IMoveQuestionFunc = (passiveProps: IMoveQuestionProps) => void;
