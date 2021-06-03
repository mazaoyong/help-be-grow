
import React, { useState, FC, useCallback } from 'react';

import Question from '../../components/question';
import { QuestionScene, SCORE_MULTIPLIER } from '../../constants';

const INIT_REVIEW_INFO = {
  comment: '',
  score: 0
};

interface IQuestionWrapperProps {
  // @TDDO: remove any
  questionInfo: any;
  onChange?: (questionId:number, paylod: Record<string, any>) => void;
}

const QuestionWrapper: FC<IQuestionWrapperProps> = ({ questionInfo, onChange }) => {
  const {
    answer: {
      answers,
      analysis
    },
    correct,
    question: {
      score,
      title,
      type,
      level,
      options: optionList,
      questionId,
    },
    serialNo,
    review,
    userAnswerList
  } = questionInfo;

  // question 中的 score 是题目的满分，review 中的 score 是实际得分
  const { comment: preReviewComment, score: preReviewScore } = (review || INIT_REVIEW_INFO);

  // 这道题目的评语
  const [reviewComment, setReviewComment] = useState(preReviewComment);
  // 这道题目的评分，传入的分数要除以 100
  const [reviewScore, setReviewScore] = useState(preReviewScore / SCORE_MULTIPLIER);

  // 更新分数或题目触发的回调
  const handleReviewStateChange = useCallback((type, value) => {
    // 更新对应的 State
    if (type === 'score') {
      setReviewScore(value);
    } else {
      setReviewComment(value);
    }
    // 更新外部的数据
    if (onChange) {
      onChange(questionId,
        {
          [type]: value,
        });
    }
  }, [onChange, questionId]);

  return (
    <Question
      key={serialNo}
      className="review-detail__answers--parts-details-item"
      index={serialNo + 1}
      title={title}
      type={type}
      level={level}
      scene={QuestionScene.REVIEW}
      scoreProps={{
        fullMarks: score / SCORE_MULTIPLIER,
        score: reviewScore,
        right: Boolean(correct),
        onScoreChange(score) {
          handleReviewStateChange('score', score);
        },
      }}
      answerProps={{
        comment: reviewComment,
        optionList,
        rightAnswer: answers,
        desc: analysis,
        studentAnswer: userAnswerList,
        onCommentChange(comment) {
          handleReviewStateChange('comment', comment);
        },
      }}
    />
  );
};

export default QuestionWrapper;
