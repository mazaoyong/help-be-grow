import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import Header, { IHeaderProps } from './Header';
import Content, { IContentProps } from './Content';
import { QuestionLevel, QuestionType } from '../../../types';
import { SCENE_PIECE_CONFIG } from './config';
import cx from 'classnames';
import styles from './index.m.scss';

export type ScoreProps = Omit<IHeaderProps, 'type' | 'level' | 'index' | 'config'>;
export type AnswerProps = Omit<IContentProps, 'type' | 'title' | 'config'>;

export interface IQuestionProps {
  index: number;
  title: string;
  level: QuestionLevel;
  type: QuestionType;
  scene: Symbol;
  scoreProps: ScoreProps;
  answerProps: AnswerProps;
  className?: string;
  /**  是否是列表中最后一个问题 */
  isLast?: boolean;
  /** 是否整体不可编辑，优先于headerConfig和contentConfig中的编辑控制 */
  disabled?: boolean;
  expandContent?: boolean;
}

export default function Question(props: IQuestionProps) {
  const { expandContent = true } = props;
  const {
    index,
    title,
    level,
    type,
    scene,
    scoreProps,
    answerProps,
    className,
    isLast,
    disabled,
  } = props;
  const config = SCENE_PIECE_CONFIG.find((item) => item.scene === scene);
  if (!config) return null;
  const copiedConfig = cloneDeep(config);
  // 全局disabled控制
  if (disabled) {
    if (!copiedConfig.headerConfig) {
      copiedConfig.headerConfig = {};
    }
    if (!copiedConfig.contentConfig) {
      copiedConfig.contentConfig = {};
    }
    copiedConfig.headerConfig.ScoreEdit = false;
    copiedConfig.headerConfig.SubjectiveScoreEdit = false;
    copiedConfig.headerConfig.ToolbarDisabled = true;
    copiedConfig.contentConfig.CommentEdit = false;
  }
  const classNames = cx(styles.question, className);
  return (
    <div className={classNames}>
      <Header
        index={index}
        isLast={isLast}
        type={type}
        level={level}
        config={copiedConfig.headerConfig}
        expandContent={expandContent}
        {...scoreProps}
      />
      <Content
        expand={expandContent}
        title={title}
        type={type}
        config={copiedConfig.contentConfig}
        {...answerProps}
      />
    </div>
  );
}

type QuestionKeys = keyof IQuestionProps;
type ScoreKeys = keyof ScoreProps;
type AnswerKeys = keyof AnswerProps;

export const MemorizedQuestion = React.memo(
  (props: IQuestionProps) => <Question {...props} />,
  function compareProps(prevProps, nextProps) {
    // 主要去除对事件判断，防止没有使用useCallback事件每次变化，onMove除外，因为onMove会影响排序
    const omitProps: QuestionKeys[] = ['scene', 'scoreProps', 'answerProps'];
    const omitScoreProps: ScoreKeys[] = [
      'onEdit',
      'onExpandChange',
      'onRemove',
      'onScoreChange',
      'onScoreRulesChange',
    ];
    const omitAnswerProps: AnswerKeys[] = ['onCommentChange'];

    // deep compare
    if (isEqual(omit(prevProps, ...omitProps), omit(nextProps, ...omitProps))) {
      if (
        isEqual(
          omit(prevProps.scoreProps, ...omitScoreProps),
          omit(nextProps.scoreProps, ...omitScoreProps),
        ) &&
        isEqual(
          omit(prevProps.answerProps, ...omitAnswerProps),
          omit(nextProps.answerProps, ...omitAnswerProps),
        )
      ) {
        return true;
      }
    }
    return false;
  },
);
