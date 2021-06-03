import React, { FC } from 'react';
import cx from 'classnames';
import { IExamResult } from '../../types';
import './styles.scss';

interface IResultTableProps {
  detail: IExamResult[],
  scrollToAnchor: Function,
}

const Answer = ({ number, result, scrollToAnchor }) => {
  const getResult = {
    0: 'incomplete',
    1: 'correct',
    2: 'wrong',
  };
  return (
    <span
      className={cx('answer-number', getResult[result])}
      onClick={() => scrollToAnchor ? scrollToAnchor(number) : {}}
    >
      {number}
    </span>
  );
};

const ResultTable: FC<IResultTableProps> = ({ detail, scrollToAnchor }) => {
  return (<div className="result-container">
    {detail && detail.map((question, index) => (
      <Answer
        key={question.questionId || index + 1}
        number={question.sort || 0}
        result={question.result || 0}
        scrollToAnchor={scrollToAnchor}
      />
    ))}
  </div>);
};

export default ResultTable;
