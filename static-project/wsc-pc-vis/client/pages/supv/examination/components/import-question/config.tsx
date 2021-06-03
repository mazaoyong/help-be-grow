import { Pop } from '@zent/compat';
import React from 'react';
import {
  QuestionType,
  QuestionLevel
} from '@ability-center/supv/question-bank';
import { IOption, IFilterProps } from '@youzan/ebiz-components/es/types/easy-list/types/filter';

import { parseRichTextJson } from './utils';
import { IGridColumn } from 'zent';

// @TODO: 从能力中心引入下面两个
const questionTypeMap: Record<QuestionType, string> = {
  [QuestionType.All]: '-',
  [QuestionType.Single]: '单选题',
  [QuestionType.Multiple]: '多选题',
  [QuestionType.Judge]: '判断题',
  [QuestionType.FillBlank]: '填空题',
  [QuestionType.Subjective]: '简答题',
};
const questionLevelMap: Record<QuestionLevel, string> = {
  [QuestionLevel.All]: '-',
  [QuestionLevel.Easy]: '简单',
  [QuestionLevel.Normal]: '普通',
  [QuestionLevel.Medium]: '较难',
};

export const columnsConfig: IGridColumn[] = [
  {
    title: '题目类型',
    width: 120,
    nowrap: true,
    bodyRender(rowData) {
      return questionTypeMap[rowData.type] || '-';
    },
  },
  {
    title: '难度',
    width: 120,
    nowrap: true,
    bodyRender(rowData) {
      return questionLevelMap[rowData.level] || '-';
    },
  },
  {
    title: '试题标题',
    width: 240,
    nowrap: true,
    bodyRender(rowData) {
      if (!rowData.title) return '-';
      const text = parseRichTextJson(rowData.title);
      return (
        <Pop content={text} trigger="hover" wrapperClassName="ellipsis">
          {text}
        </Pop>
      );
    },
  },
];

// @TODO: 从能力中心引入下列选项

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

export const questionBankListConfig: IFilterProps['config'] = [
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
