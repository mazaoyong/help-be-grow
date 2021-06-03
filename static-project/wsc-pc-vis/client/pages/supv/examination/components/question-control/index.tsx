import { Select } from '@zent/compat';
import React from 'react';
import { QuestionType } from '../../../types';
import { MultiSelectQuestionRules, FillBlankQuestionRules, IQuestionControl, QuestionRule } from '../../types';
import styles from './index.m.scss';
import { getTypeText } from '../../utils';
import { NumberInput } from 'zent';
import { multiScoreCondition, SCORE_DECIMAL, MIN_QUESTION_SCORE, MAX_QUESTION_SCORE } from '../../constants';

interface IQuestionControlProps {
  data: IQuestionControl;
  disabled?: boolean;
  onScoreChange?: (type: QuestionType, score: number) => void;
  onScoreRulesChange?: (
    type: QuestionType,
    rule: QuestionRule,
    score: number,
  ) => void;
}
export default function QuestionControl(props: IQuestionControlProps) {
  const { data, onScoreChange, onScoreRulesChange, disabled = false } = props;
  const { type, perScore, count, totalScore, rule, ruleScore } = data;
  return (
    <div className={styles.control}>
      <div className={styles.header}>{getTypeText(type)}</div>
      {type !== QuestionType.FillBlank && (
        <div className={styles.line}>
          <div className={styles.left}>每题：</div>
          <div className={styles.right}>
            <NumberInput
              showStepper
              disabled={disabled}
              value={perScore}
              decimal={SCORE_DECIMAL}
              min={MIN_QUESTION_SCORE}
              max={MAX_QUESTION_SCORE}
              onChange={(e) => onScoreChange && onScoreChange(type, +(e || 0))}
            />
            分
          </div>
        </div>
      )}
      {type === QuestionType.Multiple && (
        <>
          <div className={styles.line}>
            <div className={styles.left}>规则：</div>
            <div className={styles.right}>
              <Select
                disabled={disabled}
                data={multiScoreCondition}
                value={rule}
                onChange={(e) =>
                  onScoreRulesChange && onScoreRulesChange(type, +e.target.value, ruleScore || 0)
                }
                popupClassName={styles.popup}
              />
            </div>
          </div>
          <div className={styles.line}>
            <div className={styles.left}>
              {rule === MultiSelectQuestionRules.LOSS_SCORE ? '少选得' : '每项'}：
            </div>
            <div className={styles.right}>
              <NumberInput
                showStepper
                disabled={disabled}
                value={ruleScore}
                decimal={SCORE_DECIMAL}
                min={MIN_QUESTION_SCORE}
                max={perScore}
                onChange={(e) =>
                  onScoreRulesChange &&
                  onScoreRulesChange(type, rule || MultiSelectQuestionRules.LOSS_SCORE, +(e || 0))
                }
              />
              分
            </div>
          </div>
        </>
      )}
      {type === QuestionType.FillBlank && (
        <div className={styles.line}>
          <div className={styles.left}>每空：</div>
          <div className={styles.right}>
            <NumberInput
              showStepper
              disabled={disabled}
              value={ruleScore}
              decimal={SCORE_DECIMAL}
              min={MIN_QUESTION_SCORE}
              max={MAX_QUESTION_SCORE}
              onChange={(e) =>
                onScoreRulesChange &&
                onScoreRulesChange(type, FillBlankQuestionRules.AVERAGE_SCORE, +(e || 0))
              }
            />
            分
          </div>
        </div>
      )}
      <div className={styles.sum}>
        共&nbsp;<span>{count}</span>&nbsp;题，共&nbsp;<span>{totalScore}</span>&nbsp;分
      </div>
    </div>
  );
}
