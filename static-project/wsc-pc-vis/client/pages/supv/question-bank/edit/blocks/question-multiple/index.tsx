import React from 'react';
import { EasyFormArchive } from '@youzan/ebiz-components';
import { ZentForm } from 'zent/es/form/ZentForm';
import { QuestionType } from '@ability-center/supv/question-bank';

import getFormConfig from '../question-single/get-form-config';
import { getStashQuestionContent } from '../../utils/stash-question-content';
import { IQuestionMultipleProps } from './types';

const { EasyForm } = EasyFormArchive;

const QuestionMultiple = React.forwardRef<ZentForm<any> | undefined, IQuestionMultipleProps>(
  function QuestionMultipleWithRef(props, ref) {
    const { className, ...controlProps } = props;
    const formRef = React.useRef<ZentForm<any>>();

    React.useImperativeHandle(ref, () => formRef.current);

    const formConfig = React.useMemo(
      () => getFormConfig({ type: 'multiple' }),
      [],
    );

    // 装载数据
    React.useLayoutEffect(() => {
      const form = formRef.current;
      if (form) {
        const stashQuestionContent = getStashQuestionContent(QuestionType.Multiple);
        if (stashQuestionContent) {
          form.initialize(stashQuestionContent);
        }
      }
    }, []);

    return (
      <section className="question-content">
        <h1>多选题编辑</h1>
        <EasyForm
          {...controlProps}
          layout="horizontal"
          ref={(form) => (formRef.current = form)}
          className={className}
          config={formConfig}
        />
      </section>
    );
  },
);

export default QuestionMultiple;
