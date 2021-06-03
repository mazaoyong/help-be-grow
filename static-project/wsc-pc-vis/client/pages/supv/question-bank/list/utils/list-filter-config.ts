import { IFilterProps, IOption } from '@youzan/ebiz-components/components/easy-list/types/filter';
import { QuestionLevel, QuestionType } from '@ability-center/supv/question-bank';

const questionTypeOptions: IOption[] = [
  {
    text: '全部题型',
    value: String(QuestionType.All),
  },
  {
    text: '单选题',
    value: String(QuestionType.Single),
  },
  {
    text: '多选题',
    value: String(QuestionType.Multiple),
  },
  {
    text: '判断题',
    value: String(QuestionType.Judge),
  },
  {
    text: '填空题',
    value: String(QuestionType.FillBlank),
  },
  {
    text: '问答题',
    value: String(QuestionType.Subjective),
  },
];

const questionLevelOptions: IOption[] = [
  {
    text: '全部难度',
    value: String(QuestionLevel.All),
  },
  {
    text: '简单',
    value: String(QuestionLevel.Easy),
  },
  {
    text: '普通',
    value: String(QuestionLevel.Normal),
  },
  {
    text: '较难',
    value: String(QuestionLevel.Medium),
  },
];

const questionBankListConfig: IFilterProps['config'] = [
  {
    name: 'type',
    type: 'Select',
    options: questionTypeOptions,
    defaultValue: String(QuestionType.All),
    inheritProps: {
      width: '144px',
    },
  },
  {
    name: 'level',
    type: 'Select',
    options: questionLevelOptions,
    defaultValue: String(QuestionLevel.All),
    inheritProps: {
      width: '144px',
    },
  },
];

export default questionBankListConfig;
