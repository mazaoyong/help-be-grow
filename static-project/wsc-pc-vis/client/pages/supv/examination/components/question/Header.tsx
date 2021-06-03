import { Select, Pop } from '@zent/compat';
import React, { useMemo, FC } from 'react';
import { QuestionLevel, QuestionType } from '../../../types';
import { getLevelText, getTypeText } from '../../utils';
import { Tag, Icon, NumberInput } from 'zent';
import { MultiSelectQuestionRules, FillBlankQuestionRules, QuestionRule } from '../../types';
import classnames from 'classnames';
import {
  DefaultQuestionScore,
  multiScoreCondition,
  SCORE_DECIMAL,
  MIN_QUESTION_SCORE,
  MAX_QUESTION_SCORE,
} from '../../constants';
import styles from './index.m.scss';

export type THeaderConfig = {
  /** 是否显示工具栏 */
  ShowToolBar?: boolean;
  /** 是否显示分数 */
  ShowScore?: boolean;
  /** 是否显示分数规则 */
  ShowRules?: boolean;
  /** 分数是否可以编辑 */
  ScoreEdit?: boolean;
  /** 工具栏是否可编辑 */
  ToolbarDisabled?: boolean;
  /** 是否展示分数结果 */
  ShowResult?: boolean;
  /** 主观题分数是否可编辑 */
  SubjectiveScoreEdit?: boolean;
  /** 是否可折叠 */
  Foldable?: boolean;
  /** 是否展示正确率 */
  ShowCorrectRate?: boolean;
};

export interface IHeaderProps {
  index: number;
  type: QuestionType;
  level: QuestionLevel;
  isLast?: boolean;
  config?: THeaderConfig;
  rule?: QuestionRule;
  ruleScore?: number;
  score?: number;
  onScoreChange?: (score: number) => void;
  onScoreRulesChange?: (
    rule: QuestionRule,
    score: number,
  ) => void;
  right?: boolean; // 是否正确
  fullMarks?: number; // 满分
  onEdit?: () => void;
  onRemove?: () => void;
  onMove?: (direction: 'up' | 'down') => void;
  /** 正确率 */
  correctRate?: number;
  /** 内容是否展开 */
  expandContent?: boolean;
  onExpandChange?: ()=>void;
}

interface IResultProps {
  type: QuestionType;
  right?: boolean;
  fullMarks?: number;
}

type TooleBarType = 'edit' | 'delete' | 'up' | 'down';

const ToolBar = (props: IHeaderProps) => {
  const { index, isLast = false, onEdit, onRemove, onMove, config } = props;
  const upDisabled = index === 1;
  const disabled = config ? !!config.ToolbarDisabled : false;
  const isAvaliable = (type) => {
    return !(disabled || (type === 'up' && upDisabled) || (type === 'down' && isLast));
  };
  const getClassName = (type: TooleBarType) => {
    return isAvaliable(type) ? '' : 'disabled';
  };
  const onClick = (type: TooleBarType) => {
    if (isAvaliable(type)) {
      switch (type) {
        case 'edit':
          onEdit && onEdit();
          break;
        case 'delete':
          onRemove && onRemove();
          break;
        case 'up':
          onMove && onMove('up');
          break;
        case 'down':
          onMove && onMove('down');
          break;
        default:
          break;
      }
    }
  };
  return (
    <div className={styles.toolbar}>
      <Icon type="edit-o" className={getClassName('edit')} onClick={() => onClick('edit')} />
      {isAvaliable('delete') ? (
        <Pop
          trigger="click"
          content={<div className={styles.popcontent}>确认删除？</div>}
          onConfirm={() => onClick('delete')}
          confirmText="删除"
          position="top-right"
        >
          <Icon type="remove-o" />
        </Pop>
      ) : (
        <Icon type="remove-o" className={getClassName('delete')} />
      )}
      <Icon type="up-circle-o" onClick={() => onClick('up')} className={getClassName('up')} />
      <Icon type="down-circle-o" onClick={() => onClick('down')} className={getClassName('down')} />
    </div>
  );
};

const Score = (props: IHeaderProps) => {
  const {
    type,
    score = DefaultQuestionScore,
    onScoreChange,
    onScoreRulesChange,
    rule = type === QuestionType.FillBlank
      ? FillBlankQuestionRules.AVERAGE_SCORE
      : type === QuestionType.Multiple
        ? MultiSelectQuestionRules.LOSS_SCORE
        : undefined,
    ruleScore = DefaultQuestionScore,
    config = {},
    fullMarks,
  } = props;
  const { ScoreEdit = true, ShowRules = true, SubjectiveScoreEdit = true, ShowResult } = config;

  const handleScoreChange = (e: string) => {
    onScoreChange && onScoreChange(+e);
  };
  const handleRuleChange = (rule: QuestionRule, val: number) => {
    onScoreRulesChange && onScoreRulesChange(rule, val);
  };
  const isSubjective = type === QuestionType.Subjective;
  const LessScore = (
    <div className={styles.score}>
      {ShowResult ? '打分' : '分数'}：
      <NumberInput
        value={score}
        showStepper
        min={MIN_QUESTION_SCORE}
        max={typeof fullMarks === 'number' ? fullMarks : MAX_QUESTION_SCORE }
        decimal={SCORE_DECIMAL}
        onChange={handleScoreChange}
        disabled={isSubjective ? !SubjectiveScoreEdit : !ScoreEdit}
      />
      分
    </div>
  );
  const FillblankScore = (
    <>
      {ShowRules && (
        <div className={styles.score}>
          每空：
          <NumberInput
            value={ruleScore}
            showStepper
            min={MIN_QUESTION_SCORE}
            decimal={SCORE_DECIMAL}
            max={MAX_QUESTION_SCORE}
            onChange={(val) => handleRuleChange(rule as QuestionRule, +val)}
            disabled={!ScoreEdit}
          />
          分
        </div>
      )}
      <div className={styles.score}>
        {ShowResult ? '打分' : '总分'}：
        <NumberInput
          value={score}
          showStepper
          min={0}
          decimal={SCORE_DECIMAL}
          onChange={handleScoreChange}
          disabled={true}
        />
        分
      </div>
    </>
  );
  const MultiScore = (
    <>
      {ShowRules && (
        <div className={styles.score}>
          <Select
            data={multiScoreCondition}
            value={rule}
            onChange={(e) => handleRuleChange(+e.target.value, ruleScore)}
            popupClassName={styles.popup}
            disabled={!ScoreEdit}
          />
          <NumberInput
            value={ruleScore}
            showStepper
            min={MIN_QUESTION_SCORE}
            decimal={SCORE_DECIMAL}
            onChange={(val) => handleRuleChange(rule as QuestionRule, +val)}
            disabled={!ScoreEdit}
          />
          分
        </div>
      )}
      <div className={styles.score}>
        {ShowResult ? '打分' : '总分'}：
        <NumberInput
          value={score}
          showStepper
          min={MIN_QUESTION_SCORE}
          max={MAX_QUESTION_SCORE}
          decimal={SCORE_DECIMAL}
          onChange={handleScoreChange}
          disabled={!ScoreEdit}
        />
        分
      </div>
    </>
  );
  switch (type) {
    case QuestionType.Single:
    case QuestionType.Judge:
    case QuestionType.Subjective:
      return LessScore;
    case QuestionType.FillBlank:
      return FillblankScore;
    case QuestionType.Multiple:
      return MultiScore;
    default:
      return null;
  }
};

const Result = (props: IResultProps) => {
  const { fullMarks, type, right } = props;
  if (type === QuestionType.Subjective) {
    return <div className={styles.result}>满分：{fullMarks || 0}分</div>;
  }
  return right ? (
    <Icon type="check-circle-o" className={styles.resultTrue} />
  ) : (
    <Icon type="close-circle-o" className={styles.resultFalse} />
  );
};

/** 题目正确率组件，用在统计分析场景 */
const CorrectRate: FC<Pick<IHeaderProps, 'correctRate'>> = ({ correctRate }) => {
  const color = Number(correctRate) < 50 ? '#da0000' : '#31b045';
  return (
    <div>
    正确率：<span style={{ color }}>{ correctRate } %</span>
    </div>
  );
};

// 展开折叠按钮
const ExpandIcon: FC<{expand?:boolean;}> = ({ expand = true }) => {
  const classNames = classnames(styles.expandIcon, { [styles.expandIconExpand]: expand });
  return (
    <div className={classNames}>
      <Icon
        type="down"
        style={{ fontSize: 20 }}
      />
    </div>
  );
};

const getComponents = (props: IHeaderProps) => {
  const { type, config, right, fullMarks, correctRate, expandContent } = props;
  if (!config) return [];
  const components: JSX.Element[] = [];
  if (config.ShowToolBar) {
    components.push(<ToolBar {...props} key={1} />);
  }
  if (config.ShowResult) {
    components.push(<Result type={type} right={right} fullMarks={fullMarks} key={2} />);
  }
  if (config.ShowScore) {
    components.push(<Score {...props} key={3} />);
  }
  if (config.ShowCorrectRate) {
    components.push(<CorrectRate correctRate={correctRate} key={5} />);
  }
  if (config.Foldable) {
    components.push(<ExpandIcon expand={expandContent} key={6} />);
  }
  return components;
};

export default function Header(props: IHeaderProps) {
  const { index, type, level, onExpandChange, config: { Foldable = false } = {} } = props;

  const theme = useMemo(() => {
    switch (level) {
      case QuestionLevel.Easy:
        return 'green';
      case QuestionLevel.Normal:
        return 'blue';
      case QuestionLevel.Medium:
        return 'yellow';
      default:
        return 'green';
    }
  }, [level]);

  const classNames = classnames(styles.header, { [styles.foldable]: Foldable });

  return (
    <div className={classNames} onClick={() => { onExpandChange && onExpandChange(); }}>
      <div className={styles.left}>
        <span key={1}>{index}.</span>
        <span key={2}>【{getTypeText(type)}】</span>
        <Tag theme={theme} outline>
          {getLevelText(level)}
        </Tag>
      </div>
      <div className={styles.right}>{getComponents(props)}</div>
    </div>
  );
}
