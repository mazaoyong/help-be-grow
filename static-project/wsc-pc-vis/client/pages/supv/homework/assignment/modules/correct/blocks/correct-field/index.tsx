import { React, useMemo, createBlock, ModelOf } from '@youzan/tany-react';
import { Validators, ValidateOccasion, Notify, BlockLoading, Button } from 'zent';
import { EasyFormConfigType } from '@youzan/ebiz-components/es/types/easy-form';
import { EasyForm } from '@youzan/ebiz-components';
import GradeSelectField from '../../components/grade-select-field';
import TextAreaField from 'components/field/text-area';
import ScoreDisplay from '../../components/score-display';
import CommentDisplay from '../../components/comment-display';
import { ImageField, AudioField, VideoField } from '../../components/media-field';
import UploaderViewContainer from 'pages/supv/homework/components/uploader-view-container';
import BottomActions from '../../fragments/bottom-actions';
import useCorrectPageModel from '../../models/correct-page';
import ConfirmButton from '../../components/confirm-button';

import { RateType, ScoreRule } from 'domain/homework-domain/types/homework';
import { workbookStudentAssignmentListRoute, assignmentCorrectRoute } from '../../../../router';
import { BooleanLike } from '../../../../../types';

import './styles.scss';

const { EasyFormRenderer, group } = EasyForm;

const model = () => {
  const {
    route,
    homeworkId,
    workbookId,
    isEdit,
    correctPageViewTypeChangeToEdit,
    authorizedStaffList,
    rateType,
    scoreRule,
    isGoodAssignment,
    formRef,
    correctData,
    formLoading,
    reviewNextAssignmentId,
    handleSubmit,
    handleLeave,
    submitLoading,
    afterSubmit,
    workbookKdtId,
    studentName,
    recordRef,
  } = useCorrectPageModel();

  const maxScore = rateType === RateType.POINT && scoreRule === ScoreRule.HUNDRED ? 100 : 10;

  const isAuthorized = !!authorizedStaffList.includes(_global.userId);

  const config: EasyFormConfigType[] = useMemo(
    () => [
      {
        name: 'grade',
        label: '作业得分',
        type: 'Custom',
        renderField: GradeSelectField,
        defaultValue: '',
        visible: rateType === RateType.GRADE,
        validators: [
          (val: string) => {
            if (rateType === RateType.GRADE && !val) {
              Notify.error('请选择作业得分');
              return {
                name: 'error',
                message: '未选择作业得分',
              };
            }
            return null;
          },
        ],
        destroyOnUnmount: true,
      },
      {
        name: 'score',
        label: '作业得分',
        type: 'NumberInput',
        inheritProps: {
          width: 80,
          decimal: 2,
          min: 0,
        },
        suffix: (
          <span className="score-suffix">
            分<span className="desc">满分 {String(maxScore)}</span>
          </span>
        ),
        validateOccasion: ValidateOccasion.Blur,
        validators:
          rateType === RateType.POINT
            ? [
              Validators.required('请输入作业得分'),
              Validators.max(maxScore, `不得超过${maxScore}分`),
            ]
            : undefined,
        visible: rateType === RateType.POINT,
        destroyOnUnmount: true,
      },
      {
        name: 'isGoodAssignment',
        label: '优秀作业',
        type: 'Radio',
        options: [
          { text: '是', value: String(BooleanLike.True) },
          { text: '否', value: String(BooleanLike.False) },
        ],
        validators: [Validators.required('请选择')],
      },
      {
        name: 'divider',
        type: 'Plain',
        node: <hr className="divider" />,
      },
      {
        name: 'comment-header',
        type: 'Plain',
        node: <h2>评语</h2>,
      },
      {
        name: 'comment',
        type: 'Custom',
        renderField: TextAreaField,
        defaultValue: '',
        fieldProps: {
          withoutLabel: true,
        },
        inheritProps: {
          className: 'comment-field',
          showCount: true,
          size: 'large',
          // autoSize: false,
          maxLength: 10000,
        },
        validateOccasion: ValidateOccasion.Change,
        Validators: [Validators.maxLength(10000, '最多可输入10000字')],
      },
      {
        name: 'media-preview',
        type: 'Plain',
        node: <UploaderViewContainer className="media-preview" anchor="media" />,
      },
      {
        name: 'audio-preview',
        type: 'Plain',
        node: <UploaderViewContainer className="media-preview" anchor="audio" />,
      },
      group({
        groupName: 'media',
        hideGroupHeader: true,
        groupTitle: '',
        config: [
          {
            name: 'image',
            type: 'Custom',
            renderField: ImageField,
            defaultValue: [],
            fieldProps: {
              withoutLabel: true,
            },
          },
          {
            name: 'video',
            type: 'Custom',
            renderField: VideoField,
            defaultValue: [],
            fieldProps: {
              withoutLabel: true,
            },
          },
          {
            name: 'audio',
            type: 'Custom',
            renderField: AudioField,
            defaultValue: [],
            fieldProps: {
              withoutLabel: true,
            },
          },
        ],
      }),
    ],
    [maxScore, rateType],
  );

  return {
    route,
    config,
    isEdit,
    formRef,
    correctData,
    formLoading,
    homeworkId,
    workbookId,
    correctPageViewTypeChangeToEdit,
    authorizedStaffList,
    workbookStudentAssignmentListRoute,
    assignmentCorrectRoute,
    rateType,
    scoreRule,
    isGoodAssignment,
    handleSubmit,
    reviewNextAssignmentId,
    submitLoading,
    isAuthorized,
    handleLeave,
    afterSubmit,
    workbookKdtId,
    studentName,
    recordRef,
  };
};

export type CorrectModelType = ModelOf<typeof model>;

const CorrectDetail = (model: CorrectModelType) => {
  const {
    config,
    formRef,
    correctData,
    formLoading,
    isEdit,
    rateType,
    scoreRule,
    isGoodAssignment,
    isAuthorized,
    handleLeave,
    correctPageViewTypeChangeToEdit,
    handleSubmit,
    submitLoading,
    workbookKdtId,
  } = model;

  if (formLoading) {
    return (
      <BlockLoading loading={true} height={600} />
    );
  }

  return (
    <>
      <div className="correct-detail">
        <h2>评分</h2>
        {isEdit ? (
          <EasyFormRenderer
            ref={formRef as any}
            config={config as any}
            onSubmit={handleSubmit}
            renderSubmit={(submit) => {
              return BottomActions(model, submit);
            }}
            scrollToError
          />
        ) : (
          <div className="score-container">
            <ScoreDisplay
              type={rateType}
              value={rateType === RateType.GRADE ? (correctData?.grade || '') : (correctData?.score || '')}
              scoreRule={scoreRule}
              isGoodAssignment={isGoodAssignment}
            />
            <hr className="divider" />
            <CommentDisplay data={correctData} />
            <div className="bottom-actions">
              <Button onClick={() => handleLeave()}>取消</Button>
              <ConfirmButton
                isAuthorized={isAuthorized}
                onClick={() => correctPageViewTypeChangeToEdit(true)}
                rigName="编辑"
                loading={submitLoading}
                disabled={workbookKdtId !== _global.kdtId}
              >
                修改批阅
              </ConfirmButton>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default createBlock({
  root: CorrectDetail,
  model,
  components: [GradeSelectField],
});
