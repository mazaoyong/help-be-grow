import { WithRouterProps } from 'react-router';
import { QuestionType, QuestionLevel, ScoringFormula } from '@ability-center/supv/question-bank';

export interface IQuestionEditProps extends WithRouterProps {}

export enum OptionsOrder {
  Fixed = 1,
  Radom,
}

export enum SubmitEffect {
  /** 创建并返回列表 */
  Create = 1,
  /** 创建完成后新建一个新的 */
  CreateNext,
}

export interface IQuestionSettingForm {
  categoryId: number;
  type: QuestionType;
  level: QuestionLevel;
  /** 0.01 字符串，需要乘100倍使用 */
  score: string;
  /** 只有多选项才有 */
  scoringFormula?: ScoringFormula;
  scoringValue?: string;
}

export interface QuestionItem {
  options: string;
  rightAnswer: boolean;
}
export interface IQuestionBaseForm {
  title: string;
  answerAnalysis: string;
}

export interface IQuestionSelectForm extends IQuestionBaseForm {
  type: QuestionType.Single | QuestionType.Multiple;
  /** 单选多选才会有，题目排序信息 */
  optionOrder: OptionsOrder;
  /** 单选多选才会有，选项信息 */
  questionOptions: Array<QuestionItem | undefined>;
}
export interface IQuestionFillBlankForm extends IQuestionBaseForm {
  type: QuestionType.FillBlank;
  answers: string[];
  answerRequest: Array<'answerOrder' | 'answerIgnoreCase'>;
}
export interface IQuestionJudgeForm extends IQuestionBaseForm {
  type: QuestionType.Judge;
  rightAnswer: boolean;
}
export interface IQuestionSubjectiveForm extends IQuestionBaseForm {
  type: QuestionType.Subjective;
  answer: string;
}
export type IQuestionContentForm =
  | IQuestionSelectForm
  | IQuestionFillBlankForm
  | IQuestionJudgeForm
  | IQuestionSubjectiveForm;
export type IQuestionSubmitForm = IQuestionSettingForm & IQuestionContentForm;

export enum FillQuestionRequestSetting {
  Available = 1,
  Disabled,
}
export interface IQuestionResponse {
  essayQuestion: {
    answer: string;
  };
  answerAnalysis: string;
  categoryId: number;
  categoryName?: string;
  id: number;
  fillQuestion: {
    answers: string[];
    scoringValue?: any;
    answerOrder: FillQuestionRequestSetting;
    answerIgnoreCase: FillQuestionRequestSetting;
  };
  judgeQuestion: {
    rightAnswer: boolean;
  };
  type: QuestionType;
  choiceQuestion: {
    questionOptions: Array<QuestionItem | undefined>;
    optionOrder: OptionsOrder;
    scoringFormula?: ScoringFormula;
    scoringValue?: any;
  };
  level: QuestionLevel;
  title: string;
  score: number;
}
