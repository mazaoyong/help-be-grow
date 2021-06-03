import React, { useCallback, useMemo } from 'react';
import { IQuestion, QuestionRule } from '../../../types';
import { QuestionScene } from '../../../constants';
import { MemorizedQuestion } from '../../../components/question';

type Direction = 'up' | 'down';
interface BaseEvents {
  onScoreChange: (id: number, score: number) => void;
  onScoreRulesChange: (id: number, rule: QuestionRule, score: number) => void;
  onEdit: (id: number) => void;
  onRemove: (id: number) => void;
  onMove: (id: number, direction: Direction) => void;
}

interface IQuesionListProps extends BaseEvents {
  questionList: IQuestion[];
  disabled: boolean;
}
interface ISingleQuesionListProps extends BaseEvents {
  question: IQuestion;
  index: number;
  len: number;
  disabled: boolean;
}

function SingleQuestion(props: ISingleQuesionListProps) {
  const {
    index,
    disabled,
    len,
    question,
    onScoreChange,
    onScoreRulesChange,
    onEdit,
    onRemove,
    onMove,
  } = props;
  const { id, title, type, level, grading, score, options, answers, analysis } = question;
  const _onScoreChange = useCallback(
    (score) => {
      onScoreChange(id, score);
    },
    [onScoreChange],
  );
  const _onScoreRulesChange = useCallback(
    (rule, score) => {
      onScoreRulesChange(id, rule, score);
    },
    [onScoreRulesChange],
  );
  const _onEdit = useCallback(() => {
    onEdit(id);
  }, [onEdit]);
  const _onMove = useCallback(
    (dir) => {
      onMove(id, dir);
    },
    [onMove],
  );
  const _onRemove = useCallback(() => {
    onRemove(id);
  }, [onRemove]);
  return (
    <MemorizedQuestion
      key={id}
      index={index + 1}
      isLast={index === len - 1}
      title={title}
      type={type}
      level={level}
      scene={QuestionScene.EDITSCORE}
      disabled={disabled}
      scoreProps={{
        rule: grading && grading.rules[0],
        ruleScore: grading && grading.score,
        score: score,
        onScoreChange: _onScoreChange,
        onScoreRulesChange: _onScoreRulesChange,
        onEdit: _onEdit,
        onMove: _onMove,
        onRemove: _onRemove,
      }}
      answerProps={{
        optionList: options,
        rightAnswer: answers,
        desc: analysis,
      }}
    />
  );
}
export default function QuestionList(props: IQuesionListProps) {
  const { questionList, disabled, ...eventProps } = props;
  const len = useMemo(() => questionList.length, [questionList]);
  return (
    <>
      {questionList.map((item, index) => {
        return (
          <SingleQuestion
            key={index}
            question={item}
            index={index}
            len={len}
            disabled={disabled}
            {...eventProps}
          />
        );
      })}
    </>
  );
}
