import { AnswerMode, QuestionType } from 'supv/examination/types';

export const disabled = {
  type: Boolean,
  default: false,
};
export const mode = {
  type: String,
  default: AnswerMode.PREVIEW,
};
export const type = {
  type: Number,
  default: QuestionType.SINGLE,
};
export const no = {
  type: Number,
  default: 0,
};
export const score = {
  type: Number,
  default: 0,
};
export const userScore = {
  type: Number,
  default: 0,
};
export const questionContent = {
  type: String,
  default: '',
};
export const optionId = {
  type: String,
  default: '',
};
export const optionContent = {
  type: String,
  default: '',
};
export const options = {
  type: Array,
  default() {
    return [];
  },
};
export const blankCount = {
  type: Number,
  default: 0,
};
export const correctAnswer = {
  type: [Array, Boolean],
  default: () => [],
};
export const userAnswer = {
  type: [Array, Boolean],
  default() {
    const type = this.type as unknown;
    if (type === QuestionType.JUDGE) {
      return undefined;
    } else {
      return [];
    }
  },
};
export const reviewContent = {
  type: String,
  default: '',
};
export const incorrect = {
  type: Boolean,
  default: false,
};
export const correct = {
  type: Boolean,
  default: false,
};
export const teacherComment = {
  type: String,
  default: '',
};
export const inReviewMode = {
  type: Boolean,
  default: false,
};
export const isReviewing = {
  type: Boolean,
  default: false,
};
export const reference = {
  type: String,
  default: '',
};

export const indexProps = {
  disabled,
  mode,
  type,
  no,
  score,
  questionContent,
  options,
  blankCount,
  correctAnswer,
  correct,
  userScore,
  userAnswer,
  reviewContent,
  teacherComment,
  isReviewing,
  reference,
};

export const questionProps = {
  type,
  no,
  questionContent,
  score,
};

export const optionProps = {
  type,
  disabled,
  correct,
  optionNo: {
    type: String,
    default: 'A',
  },
  optionId,
  optionContent,
  checked: {
    type: Boolean,
    default: false,
  },
  incorrect,
  inReviewMode,
};

export const blankProps = {
  disabled,
  correct,
  incorrect,
  label: {
    type: String,
    default: '填空1',
  },
  value: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
};

export const answerProps = {
  no,
  disabled,
  inReviewMode,
  type,
  blankCount,
  options,
  correctAnswer,
  userAnswer,
};

export const reviewProps = {
  type,
  userScore,
  correct,
  correctAnswer,
  userAnswer,
  reviewContent,
  teacherComment,
  isReviewing,
  reference,
  chooseOptionNos: {
    type: Array,
    default: () => [],
  },
};
