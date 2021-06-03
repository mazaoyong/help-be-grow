import React, { FC, useEffect, useState } from 'react';
import { BlockLoading, Notify } from 'zent';
import QuestionItem from './question-item';
import BlankState from '../../../../components/blank-state';

import { IBlockBaseProps, IExamQuestionStatistics } from '../../types';

import { getExamninationCorrectRates } from '../../../../api';

const Analysis: FC<IBlockBaseProps> = ({ examTemplateId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [questionsList, setQuestionList] = useState<IExamQuestionStatistics[]>([]);
  useEffect(() => {
    getExamninationCorrectRates(examTemplateId).then(resp => {
      // todo
      setQuestionList(resp || []);
    }).catch((msg) => {
      Notify.error(msg || '网络错误');
    }).finally(() => {
      setLoading(false);
    });
  }, [examTemplateId]);
  if (loading) {
    return <BlockLoading loading />;
  }

  return (questionsList.length === 0
    ? <BlankState />
    : <section>
      {
        questionsList.map(info => (
          <QuestionItem
            key={info.question.questionId}
            questionInfo={info}
            examTemplateId={examTemplateId}
          />
        ))}
    </section>
  );
};

export default Analysis;
