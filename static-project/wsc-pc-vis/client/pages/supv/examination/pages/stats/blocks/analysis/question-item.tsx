
import React, { FC, useState, useCallback, useRef } from 'react';

import { IExamQuestionStatistics, IQuetionOptionsChosenRate } from '../../types';

import Question from '../../../../components/question';
import { QuestionScene } from '../../../../constants';

import { getQuestionOptionsCorrectRate } from '../../../../api';

import { IOptions } from '../../../../types';
import { QuestionType } from '../../../../../types';

const QuestionItem: FC<{questionInfo: IExamQuestionStatistics; examTemplateId:number; }> = (
  { questionInfo, examTemplateId }
) => {
  const {
    serialNo,
    answer: {
      answers,
      analysis
    },
    correctRate,
    question: {
      title,
      type,
      level,
      options,
      questionId
    },
  } = questionInfo;

  const [optionList, setOptionList] = useState<IOptions[]>(generateInitOptionsList(type, options, answers));

  const [expand, setExpand] = useState<boolean>(false);

  const FETCH_STATUS = useRef<'none'|'pending'|'done'>('none');

  const fetchOptionsCorrectRate = useCallback(() => {
    const query = { questionOptionQuery: { examTemplateId, questionId } };
    FETCH_STATUS.current = 'pending';
    getQuestionOptionsCorrectRate(query).then(resp => {
      const formatedOptionList = formatOptionList(resp);
      setOptionList(formatedOptionList);
      FETCH_STATUS.current = 'done';
    }).catch(() => {
      FETCH_STATUS.current = 'none';
    });
  }, [examTemplateId, questionId]);

  const handleExpandChange = useCallback(() => {
    setExpand(expand => !expand);
    if (FETCH_STATUS.current === 'none') {
      fetchOptionsCorrectRate();
    }
  }, [fetchOptionsCorrectRate]);

  return (
    <Question
      className="review-detail__answers--parts-details-item"
      index={serialNo + 1}
      title={title}
      type={type}
      level={level}
      scene={QuestionScene.STATISTICS}
      scoreProps={{
        correctRate,
        onExpandChange: handleExpandChange
      }}
      answerProps={{
        optionList,
        rightAnswer: answers,
        desc: analysis,
      }}
      expandContent={expand}
    />
  );
};

export default QuestionItem;

function generateInitOptionsList(type: QuestionType, options:IOptions[], answers:string[]):IOptions[] {
  switch (type) {
    case QuestionType.Single:
    case QuestionType.Multiple:
      return options;
    case QuestionType.Judge:
      return [
        {
          content: '正确',
        },
        {
          content: '错误',
        }
      ];
    case QuestionType.FillBlank:
      return answers.map((item, idx) => ({ content: `答案 ${idx + 1}：${item}` }));
    default:
      return [];
  }
}

function formatOptionList(data:IQuetionOptionsChosenRate):IOptions[] {
  const {
    examQuestion: { type = 0 } = {},
    questionOptionStatisticsDTOList = [],
    questionFillStatisticsDTOList = [],
    questionJudgeStatisticsDTO
  } = data;

  switch (type) {
    case QuestionType.Single:
    case QuestionType.Multiple:
      return questionOptionStatisticsDTOList.map(item => {
        const { option, chosenRate } = item;
        return {
          ...option,
          chosenRate
        };
      });
    case QuestionType.Judge:
      const { chosenRightRate, chosenWrongRate } = questionJudgeStatisticsDTO;
      return [
        {
          content: '正确',
          chosenRate: chosenRightRate,
        },
        {
          content: '错误',
          chosenRate: chosenWrongRate
        }
      ];
    case QuestionType.FillBlank:
      return questionFillStatisticsDTOList.map((item, idx) => {
        const { answer, answerRightRate } = item;
        return {
          content: `答案 ${idx + 1}：${answer}`,
          chosenRate: answerRightRate
        };
      });
    default:
      return [];
  }
}
