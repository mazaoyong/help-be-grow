import React from 'react';
import { QuestionType } from '@ability-center/supv/question-bank';
import { IFormRenderProps } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { ZentForm } from 'zent/es/form/ZentForm';

import QuestionSingle from '../question-single';
import QuestionMultiple from '../question-multiple';
import QuestionJudge from '../question-judge';
import QuestionSubjective from '../question-subjective';
import QuestionFillBlank from '../question-fillblank';

interface ISwitchComponentProps extends Partial<IFormRenderProps> {
  questionType: QuestionType;
}
type SwitchComponentRef = ZentForm<any> | undefined;
const SwitchComponent = React.forwardRef<SwitchComponentRef, ISwitchComponentProps>(
  function SwitchComponentWithRef(props, ref) {
    const { questionType, ...passiveProps } = props;
    const switchCompRef = React.useRef<SwitchComponentRef>();
    const Component = React.useMemo(() => {
      switch (questionType) {
        case QuestionType.All:
        case QuestionType.Single:
          return QuestionSingle;
        case QuestionType.Multiple:
          return QuestionMultiple;
        case QuestionType.Judge:
          return QuestionJudge;
        case QuestionType.Subjective:
          return QuestionSubjective;
        case QuestionType.FillBlank:
          return QuestionFillBlank;
        default:
          return QuestionSingle;
      }
    }, [questionType]);

    React.useImperativeHandle(ref, () => switchCompRef.current);

    return (
      <div className="question-content_switchWrapper">
        <Component
          {...passiveProps}
          className="modify-question__form vertical"
          ref={switchCompRef}
        />
      </div>
    );
  },
);

export default SwitchComponent;
