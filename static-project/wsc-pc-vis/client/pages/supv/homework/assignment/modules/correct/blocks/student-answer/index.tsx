import { React, useMemo, createBlock, ModelOf } from '@youzan/tany-react';
import { BlockLoading } from 'zent';
import useCorrectPageModel from '../../models/correct-page';
import { renderElement, categoriseMediaByType, renderMediaByType } from '../../utils';
import { RenderType } from '../../types';
import { ElementType } from '../../../../../types';

import './styles.scss';

const AnswerModel = () => {
  const { answerDetail, formLoading } = useCorrectPageModel();

  const firstElement = answerDetail?.[0];

  const answerText = useMemo(
    () =>
      firstElement?.mediaType === ElementType.RichText
        ? renderElement(firstElement, 0, RenderType.DETAIL)
        : '',
    [firstElement],
  );

  const mediaElement = useMemo(
    () => (answerDetail ? renderMediaByType(categoriseMediaByType(answerDetail)) : null),
    [answerDetail],
  );

  return {
    answerText,
    mediaElement,
    formLoading,
  };
};

const AnswerDetail = (model: ModelOf<typeof AnswerModel>) => {
  const { answerText, mediaElement, formLoading } = model;

  return (
    <div className="student-answer__container">
      <h3>学员答案：</h3>
      {!formLoading
        ? (
          <div className="answer-detail">
            <div className="text">{answerText}</div>
            <div className="media">{mediaElement}</div>
          </div>
        )
        : (
          <BlockLoading loading={true} height={300} />
        )
      }
    </div>
  );
};

export default createBlock({
  root: AnswerDetail,
  model: AnswerModel,
});
