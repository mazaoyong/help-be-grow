import React, { FC } from 'react';
import ResultTable from './result-table';
import { IExamAnswerSheetProps, IExamHeaderProps } from '../../types';

import './styles.scss';

const Title = ({ children }) => {
  return (
    <div className="answer-sheet-title">
      <div className="split-title">
        <i className="split" />
        {children}
      </div>
    </div>
  );
};

const Header: FC<IExamHeaderProps> = ({ correctNum, errorNum }) => {
  return (
    <div className="answer-sheet-header">
      <div className="answer-sheet-header-fragment">
        <span className="answer-sheet-header-fragment-number">{correctNum}</span>
        <span className="answer-sheet-header-fragment-desc">答对数</span>
      </div>
      <div className="answer-sheet-header-fragment">
        <span className="answer-sheet-header-fragment-number">{errorNum}</span>
        <span className="answer-sheet-header-fragment-desc">答错数</span>
      </div>
    </div>
  );
};

const AnswerSheet: FC<IExamAnswerSheetProps> = props => {
  const { examDetail, examRecord, scrollToAnchor } = props;

  return (
    <div className="answer-sheet-container">
      <Title>
        <h3>答题卡</h3>
      </Title>
      <Header correctNum={examRecord.correctNum} errorNum={examRecord.errorNum} />
      <ResultTable detail={examDetail} scrollToAnchor={scrollToAnchor} />
    </div>
  );
};

export default AnswerSheet;
