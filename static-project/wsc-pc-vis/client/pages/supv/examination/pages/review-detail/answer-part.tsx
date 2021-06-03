import React, { useState, FC } from 'react';
import { Icon } from 'zent';
import QuestionWrapper from './question-wrapper';

import { IAnswerPartProps } from './types';

const AnswerPart: FC<IAnswerPartProps> = ({
  title, subtitle, statistics, defaultExpand, score, questions = [], onQuestionChange
}) => {
  const [isExpand, setIsExpand] = useState<boolean>(Boolean(defaultExpand));

  if (questions.length === 0) {
    return null;
  }
  return (
    <div className="review-detail__answers--parts">
      <header className="review-detail__answers--parts-header">
        <div className="review-detail__answers--parts-header_title">
          <div className="review-detail__answers--parts-header_title-text">
            <span>{title}</span>
            {subtitle && (
              <span className="review-detail__answers--parts-header_title-text-desc">
                {subtitle}
              </span>
            )
            }
          </div>
          <div
            onClick={() => {
              setIsExpand((value) => !value);
            }}
            className={`review-detail__answers--parts-header_title-icon ${isExpand ? '' : 'review-detail__answers--parts-header_title-icon-hidden'}`}
          >
            <Icon
              type="up"
              style={{ fontSize: 20 }}
            />
          </div>
        </div>
        <dl className="review-detail__answers--parts-header_info">
          {statistics.map(item => (
            <div key={item.text} className="review-detail__answers--parts-header_info-item">
              <dt>{item.text}</dt><dd className={item.type || ''}>{item.value}</dd>
            </div>
          ))}
          <div className="review-detail__answers--parts-header_info-item">
            <dt>得分</dt><dd>{Number(score).toFixed(2)}</dd>
          </div>
        </dl>
      </header>
      <div hidden={!isExpand} className="review-detail__answers--parts-details">
        {questions.map(
          // @ts-ignore
          questionInfo => (<QuestionWrapper
            key={questionInfo.serialNo}
            questionInfo={questionInfo}
            onChange={onQuestionChange}
          />)
        )}
      </div>
    </div>
  );
};

export default AnswerPart;
