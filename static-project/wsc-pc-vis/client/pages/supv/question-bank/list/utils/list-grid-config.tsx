import React from 'react';
import { Operations } from '@youzan/react-components';
import { PopEllipsisText, EasyList } from '@youzan/ebiz-components';
import get from 'lodash/get';

import { IEasyGridColumn } from '@youzan/ebiz-components/components/easy-list/types/grid';

import {
  QuestionType,
  QuestionLevel,
  IClassifyTreeItem,
  QuestionEditLink,
  IParagraph,
} from '@ability-center/supv/question-bank';

import getConvertString from '../../utils/get-convert-string';
import { IQuestionBankListDataType, IDeleteQuestionsFunc, IMoveQuestionFunc } from '../types';

const { GridPop } = EasyList;

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

interface IPassiveMethods {
  deleteQuestions: IDeleteQuestionsFunc;
  moveQuestions: IMoveQuestionFunc;
}
const columnsConfig = (
  methods: IPassiveMethods,
  selectedCategory?: IClassifyTreeItem,
): IEasyGridColumn<IQuestionBankListDataType>[] => [
  {
    title: '试题标题',
    bodyRender(rowData) {
      const title = getConvertString(rowData.title, getContent);
      if (!title) return '-';
      return (
        <div className="widthRefer">
          <PopEllipsisText text={title} selector=".widthRefer" deferEllipsis />
        </div>
      );
    },
  },
  {
    title: '试题类型',
    width: '120px',
    bodyRender(rowData) {
      return questionTypeMap[rowData.type] || '-';
    },
  },
  {
    title: '试题分类',
    width: '120px',
    bodyRender(rowData) {
      const { categoryName } = rowData;
      if (!categoryName) return '-';
      return <PopEllipsisText text={categoryName} renderVirtualNode width={120} />;
    },
  },
  {
    title: '难度',
    width: '80px',
    bodyRender(rowData) {
      return questionLevelMap[rowData.level] || '-';
    },
  },
  {
    title: '分值',
    width: '80px',
    // 后端数字保留两位小数
    bodyRender(rowData) {
      return Number(rowData.score && rowData.score / 100);
    },
  },
  {
    title: '操作',
    fixed: 'right',
    textAlign: 'right',
    width: '192px',
    bodyRender(rowData) {
      const questionId = rowData.id;
      const categoryId = get(selectedCategory, 'id', 0);
      const categoryName = get(selectedCategory, 'title', '');
      const items: React.ReactNode[] = [
        <QuestionEditLink
          key="edit"
          queries={{
            type: 'edit',
            questionId,
            categoryId,
            categoryName,
          }}
          linkProps={{ className: 'cursor-link', target: '_self' }}
        >
          编辑
        </QuestionEditLink>,
        <a
          className="cursor-link"
          key="translate"
          onClick={() => methods.moveQuestions({ moveIds: [questionId], needSystemDefault: true })}
        >
          移动
        </a>,
        <QuestionEditLink
          key="duplicate"
          queries={{ type: 'duplicate', questionId, categoryId, categoryName }}
          linkProps={{ className: 'cursor-link' }}
        >
          复制
        </QuestionEditLink>,
        <GridPop
          text="删除"
          key="delete"
          trigger="click"
          confirmText="确定"
          position="top-right"
          className="double-confirm"
          content="删除后不可恢复，确认删除？"
          onConfirm={() => methods.deleteQuestions([questionId])}
        />,
      ];
      return <Operations items={items} />;
    },
  },
];

export default columnsConfig;

function getContent(item: IParagraph): string {
  const { type, text, attr = '', nodes } = item;
  // 如果是a标签并且是视频连接
  if (type === 'a' && /video-link/.test(attr)) {
    return '[视频]';
  }
  if (Array.isArray(nodes) && nodes.length) {
    return text + nodes.map(getContent).join('');
  }
  if (type === 'img') {
    return '[图片]';
  } else if (type === 'iframe') {
    return '[视频]';
  }
  return text;
}
