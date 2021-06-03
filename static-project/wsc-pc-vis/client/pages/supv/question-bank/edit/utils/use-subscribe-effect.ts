import React from 'react';
import { FieldModel, FieldArrayModel } from 'zent';
import { ZentForm } from 'zent/es/form/ZentForm';
import { QuestionType } from '@ability-center/supv/question-bank';

// 处理model对象订阅的副作用
function useSubscribeEffect(
  afterInitial: boolean,
  type: QuestionType,
  formRefs: {
    settingFormRef: React.MutableRefObject<ZentForm<any> | null | undefined>;
    contentFormRef: React.MutableRefObject<ZentForm<any> | null | undefined>;
  },
) {
  const autoCalcFillBlankScore = React.useCallback(
    (
      form: {
        questionSettingForm: ZentForm<any>;
        questionContentForm: ZentForm<any>;
      },
      nextQuestionType: QuestionType,
      RAFTimer: number,
    ) => {
      const { questionContentForm, questionSettingForm } = form;
      // 获取计分的model
      const scoringValueModel: FieldModel<string> = questionSettingForm.model.get('scoringValue');
      const scoreModel: FieldModel<string> = questionSettingForm.model.get('score');
      const answersModel: FieldArrayModel<string> = questionContentForm.model.get('answers');
      if (scoringValueModel && scoreModel && answersModel) {
        cancelAnimationFrame(RAFTimer);
        scoringValueModel.value$.subscribe((nextScoringValue) => {
          let currentScore = scoreModel.getRawValue();
          if (nextQuestionType === QuestionType.FillBlank) {
            currentScore = String(answersModel.getRawValue().length * Number(nextScoringValue));
          }
          scoreModel.patchValue(currentScore);
          // 设置完成总分之后，触发重新校验，因为用户可能在其他题目类型中删除分数之后
          scoreModel.validate();
        });
        answersModel.children$.subscribe((nextAnswers) => {
          let currentScore = scoreModel.getRawValue();
          if (nextQuestionType === QuestionType.FillBlank) {
            currentScore = String(nextAnswers.length * Number(scoringValueModel.getRawValue()));
          }
          scoreModel.patchValue(currentScore);
        });
      }
    },
    [],
  );

  const autoCalcScore = React.useCallback(
    (nextQuestionType) => {
      const questionSettingForm = formRefs.settingFormRef.current;
      const questionContentForm = formRefs.contentFormRef.current;
      if (
        nextQuestionType === QuestionType.FillBlank &&
        questionContentForm &&
        questionSettingForm
      ) {
        const RAFTimer = requestAnimationFrame(() =>
          autoCalcFillBlankScore(
            { questionSettingForm, questionContentForm },
            nextQuestionType,
            RAFTimer,
          ),
        );
      }
    },
    [autoCalcFillBlankScore, formRefs.contentFormRef, formRefs.settingFormRef],
  );

  React.useEffect(() => {
    if (afterInitial) {
      autoCalcScore(type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterInitial, type]);
}

export default useSubscribeEffect;
