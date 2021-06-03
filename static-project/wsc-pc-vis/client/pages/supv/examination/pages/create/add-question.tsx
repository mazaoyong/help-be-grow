import React, { useState, useMemo, useEffect, useCallback } from 'react';
import get from 'lodash/get';
import QuestionControl from '../../components/question-control';
import { SCORE_DECIMAL } from '../../constants';
import { Button, Affix, Notify, BlockLoading, Icon, Alert } from 'zent';
import Footer from './blocks/footer';
import { Dialog } from '@youzan/ebiz-components';
import ImportQuestion from '../../components/import-question';
import { IQuestion, IQuestionControl, QuestionRule } from '../../types';
import {
  computeQuestion,
  adaptSettingData,
  adaptQuestionData,
  reverseAdaptQuestionData,
  adaptEditSettingData,
  ruleScoreEffect,
  computeMaxRuleScore,
} from './utils';
import {
  createExamTemplate,
  createExamPaper,
  findPaperQuestions,
  getExamPaperDetail,
  updateExamTemplate,
} from '../../api';
import store from './store';
import { safeMul, safeAdd } from '../../utils';
import { QuestionType, openEditQuestionContentDialog } from '@ability-center/supv/question-bank';
import QuestionList from './blocks/question-list';
import openSubscribeDialog from '../../components/subscribe-dialog';

const multiplier = 10 ** SCORE_DECIMAL;
const { openDialog } = Dialog;

type Direction = 'up' | 'down';
interface IQuestionContainerProps {
  title: string;
  questionList: IQuestion[];
  onScoreChange: (id: number, score: number) => void;
  onScoreRulesChange: (id: number, rule: QuestionRule, score: number) => void;
  onEdit: (id: number) => void;
  onRemove: (id: number) => void;
  onMove: (id: number, direction: Direction) => void;
  setQuestionList: (q: any) => void;
  disabled: boolean;
}

interface IQuestionBoardProps {
  count: number;
  totalScore: number;
  questionControl: IQuestionControl[];
  onScoreChange: (type: QuestionType, score: number) => void;
  onScoreRulesChange: (type: QuestionType, rule: QuestionRule, score: number) => void;
  disabled: boolean;
}

function QuestionContainer(props: IQuestionContainerProps) {
  const {
    title,
    questionList,
    onScoreChange,
    onScoreRulesChange,
    onEdit,
    onMove,
    onRemove,
    setQuestionList,
    disabled,
  } = props;

  const onClickImportButton = () => {
    const dialogRef = openDialog(ImportQuestion, {
      // 传入试卷中已经有的题目的 id
      data: { exitsQuestionIds: questionList.map((item) => item.id) },
      title: '导入题目',
      mask: true,
      className: 'import-dialog',
    });

    dialogRef
      .afterClosed()
      .then((data) => {
        let params: string | number[] = data;
        if (Array.isArray(data)) {
          params = data.join(',');
        }
        if (params.length === 0) {
          setQuestionList([]);
          return;
        }
        findPaperQuestions(params).then((res) => {
          const questions = reverseAdaptQuestionData(res);
          setQuestionList([...questions]);
        });
      })
      .catch(() => {});
  };

  return (
    <div className="question-container">
      <div className="question-title">{title}</div>
      {disabled && (
        <Alert type="warning" closable description="已有学员参加的考试，不能修改考试题目" />
      )}
      <div className="question-list">
        <QuestionList
          questionList={questionList}
          disabled={disabled}
          onScoreChange={onScoreChange}
          onScoreRulesChange={onScoreRulesChange}
          onEdit={onEdit}
          onMove={onMove}
          onRemove={onRemove}
        />
      </div>
      <div className="question-import">
        <Button onClick={onClickImportButton} icon="plus-circle-o" disabled={disabled}>
          {questionList.length > 0 ? '继续导入' : '从题库中导入题目'}
        </Button>
      </div>
      {questionList.length > 0 && !disabled && (
        <div onClick={onClickImportButton} className="question-import-fixed">
          <Icon type="plus-circle-o" />
          继<br />续<br />导<br />入
        </div>
      )}
    </div>
  );
}
function QuestionBoard(props: IQuestionBoardProps) {
  const { count, totalScore, questionControl, onScoreChange, onScoreRulesChange, disabled } = props;
  return (
    <div className="question-board">
      <div className="question-board-content">
        {questionControl
          .sort((a, b) => a.type - b.type)
          .map((item, index) => (
            <QuestionControl
              disabled={disabled}
              key={index}
              data={item}
              onScoreChange={onScoreChange}
              onScoreRulesChange={onScoreRulesChange}
            />
          ))}
      </div>
      <div className="question-board-footer">
        <div>总题数：{count} 题</div>
        <div>总分数：{totalScore} 分</div>
      </div>
    </div>
  );
}

export default function AddQuestion({ index, next, last, id }) {
  const [setting, setSetting] = store.useStoreBy('setting');
  const [questionList, setQuestionList] = store.useStoreBy('questionList');
  const [, setTemplateId] = store.useStoreBy('id');
  const [attendExamStudentCount] = store.useStoreBy('attendExamStudentCount');
  const [questionControl, setQuestionControl] = useState<IQuestionControl[]>([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const totalScore = useMemo(() => {
    return questionList.reduce((prev, item) => {
      prev = safeAdd(prev, safeMul(item.score, multiplier));
      return prev;
    }, 0);
  }, [questionList]);
  // 如果有学员已经参加考试，那么不在编辑题目以及提交题目
  const disabled = useMemo(() => attendExamStudentCount > 0, [attendExamStudentCount]);

  const handleSingleScoreChange = useCallback(
    (id: number, score: number) => {
      const question = questionList.find((item) => item.id === id);
      if (question) {
        question.score = score;
        setQuestionList([...questionList]);
      }
    },
    [questionList, setQuestionList],
  );

  const handleScoreRulesChange = useCallback(
    (id: number, rule: QuestionRule, score: number) => {
      const question = questionList.find((item) => item.id === id);
      if (question) {
        ruleScoreEffect(question, rule, score);
        setQuestionList([...questionList]);
      }
    },
    [questionList, setQuestionList],
  );

  const handleBoardScoreChange = useCallback(
    (type: QuestionType, score: number) => {
      const questions = questionList.filter((item) => item.type === type);
      if (questions.length > 0) {
        questions.forEach((qs) => (qs.score = score));
        setQuestionList([...questionList]);
      }
    },
    [questionList, setQuestionList],
  );

  const handleBoardScoreRulesChange = useCallback(
    (type: QuestionType, rule: QuestionRule, score: number) => {
      const questions = questionList.filter((item) => item.type === type);
      const minRuleScore = Math.min(
        ...questions.map((item) => computeMaxRuleScore(item, type, rule)),
      );
      if (questions.length > 0) {
        questions.forEach((qs) => {
          ruleScoreEffect(qs, rule, score, minRuleScore);
        });
        setQuestionList([...questionList]);
      }
    },
    [questionList, setQuestionList],
  );

  const onEdit = useCallback(
    (id: number) => {
      openEditQuestionContentDialog({ questionId: id })
        .afterClosed()
        .then(() => {
          findPaperQuestions([id]).then((res) => {
            const index = questionList.findIndex((item) => item.id === id);
            questionList[index] = reverseAdaptQuestionData(res)[0];
            setQuestionList([...questionList]);
          });
        });
    },
    [questionList, setQuestionList],
  );

  const onRemove = useCallback(
    (id: number) => {
      const index = questionList.findIndex((item) => item.id === id);
      if (index > -1) {
        questionList.splice(index, 1);
        setQuestionList([...questionList]);
      }
    },
    [questionList, setQuestionList],
  );

  const sortedIds = useMemo(() => questionList.map((item) => item.id).join(','), [questionList]);
  const onMove = useCallback(
    (id: number, direction: Direction) => {
      const index = questionList.findIndex((item) => item.id === id);
      if (direction === 'up') {
        if (index !== 0) {
          const temp = questionList[index - 1];
          questionList[index - 1] = questionList[index];
          questionList[index] = temp;
          setQuestionList([...questionList]);
        }
      } else if (direction === 'down') {
        if (index !== questionList.length - 1) {
          const temp = questionList[index + 1];
          questionList[index + 1] = questionList[index];
          questionList[index] = temp;
          setQuestionList([...questionList]);
        }
      }
    },
    [sortedIds, setQuestionList],
  );

  const onCreate = async () => {
    if (!get(_global, 'pluginInfo.canBeUsed', false)) {
      openSubscribeDialog();
      return;
    }

    setLoading(true);
    setBtnLoading(true);
    try {
      let templateId: number;
      if (id) {
        const data = adaptEditSettingData(id, setting);
        await updateExamTemplate(data);
        templateId = id;
      } else {
        const data = adaptSettingData(setting);
        const res = await createExamTemplate(data);
        templateId = res;
      }
      if (!disabled) {
        const questionData = adaptQuestionData(templateId, questionList);
        await createExamPaper(questionData);
      }
      setTemplateId(templateId);
      // 需要清空全局数据
      setSetting({});
      setQuestionList([]);
      setLoading(false);
      setBtnLoading(false);
      next();
    } catch (e) {
      setLoading(false);
      setBtnLoading(false);
      Notify.error(e);
    }
  };

  useEffect(() => {
    if (id && questionList.length === 0) {
      setLoading(true);
      getExamPaperDetail(id)
        .then((res) => {
          const questions = reverseAdaptQuestionData(res.questions);
          setLoading(false);
          setQuestionList(questions);
        })
        .catch((e) => {
          Notify.error(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setQuestionControl(computeQuestion(questionList));
  }, [questionList]);

  return (
    <div className="add-question">
      <BlockLoading loading={loading}>
        <div className="add-question-inner">
          <QuestionContainer
            title={setting.name}
            questionList={questionList}
            onScoreChange={handleSingleScoreChange}
            onScoreRulesChange={handleScoreRulesChange}
            onEdit={onEdit}
            onMove={onMove}
            onRemove={onRemove}
            setQuestionList={setQuestionList}
            disabled={disabled}
          />
          {/* @upgrade: zent8 */}
          <Affix placeholderClassName="right-affix">
            <QuestionBoard
              count={questionList.length}
              totalScore={totalScore / multiplier}
              questionControl={questionControl}
              onScoreChange={handleBoardScoreChange}
              onScoreRulesChange={handleBoardScoreRulesChange}
              disabled={disabled}
            />
          </Affix>
          <Footer
            index={index}
            onLastClick={last}
            onClick={onCreate}
            nextDisabled={questionList.length === 0}
            nextLoading={btnLoading}
            isEdit={!!id}
          />
        </div>
      </BlockLoading>
    </div>
  );
}
