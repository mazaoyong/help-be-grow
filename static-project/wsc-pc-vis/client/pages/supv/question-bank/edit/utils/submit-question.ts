import get from 'lodash/get';
import pick from 'lodash/pick';
import { QuestionType } from '@ability-center/supv/question-bank';
import accMul from '@youzan/utils/number/accMul';

import {
  isSelectQuestion,
  isFillBlankQuestion,
  isJudgeQuestion,
  isSubjectiveQuestion,
} from './pre-submit-question';
import { createQuestion, updateQuestion } from '../../../api/question-bank';
import { IQuestionResponse, IQuestionSubmitForm, FillQuestionRequestSetting } from '../types';

const commonSubmitDataKeys: Partial<keyof IQuestionResponse>[] = [
  'title',
  'type',
  'level',
  'id',
  'categoryId',
  'answerAnalysis',
];

// 新建编辑试题
function submitQuestion(
  submitType: 'create' | 'update' | '',
  ...forms: Record<string, any>[]
): Promise<boolean> {
  const [formData0, formData1] = forms;
  const originFormData: IQuestionSubmitForm = Object.assign(
    {} as IQuestionSubmitForm,
    formData0,
    formData1,
  );
  const submitData: IQuestionResponse = {} as any;
  const { type } = originFormData;

  /**
   * 处理格式化数据
   * ⚠️这里需要注意的是，数据最好一次性处理完成，而不应该在后续进行统一的修饰！！！
   * 即：如果需要设置判断题的数据，应该在getJudgeQuestionForm中设置好所有字段，
   * 而不应该在switch case执行完成之后（或者后续任意步骤中）完善判断题的其他字段
   * ❓为啥要这么约定？--数据的组装应该发生在同一个地方，而不应该散落各处！！！
   */
  const commonSubmitData = pick(originFormData, commonSubmitDataKeys);
  Object.assign(submitData, commonSubmitData);
  const scoreData = decorateQuestionScore(originFormData);
  Object.assign(submitData, scoreData);
  // 在处理分数的时候已经顺带处理了类型为单选多选和填空的情况
  switch (type) {
    case QuestionType.Judge:
      const judgeForm = getJudgeQuestionForm(originFormData);
      Object.assign(submitData, judgeForm);
      break;
    case QuestionType.Subjective:
      const subjectiveForm = getSubjectiveQuestionForm(originFormData);
      Object.assign(submitData, subjectiveForm);
      break;
    default:
      break;
  }

  if (submitData) {
    const hash = location.hash;
    const isCreateType = submitType ? submitType === 'create' : /#\/create|duplicate/.test(hash);
    const isUpdateType = submitType ? submitType === 'update' : /#\/edit/.test(hash);
    // 复制也是走创建接口
    if (isCreateType) {
      return createQuestion(submitData);
    } else if (isUpdateType) {
      return updateQuestion(submitData);
    } else {
      console.error('方法入参错误，请确认URL是否正确，以及是否有submitType参数');
    }
  }
  return Promise.reject('网络异常，请稍后重试');
}

export default submitQuestion;

function getScore(score: string | undefined) {
  const numberedScore = Number(score);
  if (numberedScore) {
    return accMul(numberedScore, 100);
  }
  return 0;
}

function getAnswerRequestValue(isChecked: boolean): FillQuestionRequestSetting {
  return isChecked ? FillQuestionRequestSetting.Available : FillQuestionRequestSetting.Disabled;
}
// 格式化带有分数的题目类型的数据
function decorateQuestionScore(questionForm: IQuestionSubmitForm): Partial<IQuestionResponse> {
  const submitData: Partial<IQuestionResponse> = {};

  const score = get(questionForm, 'score');
  submitData.score = getScore(score);

  if (isSelectQuestion(questionForm)) {
    // 如果是单/多选题，需要将分数乘上100，并收集scoringFormula等字段
    const { type, questionOptions, scoringValue, scoringFormula, optionOrder } = questionForm;
    const choiceQuestion: IQuestionResponse['choiceQuestion'] = {
      questionOptions,
      optionOrder,
    };
    if (type === QuestionType.Multiple) {
      choiceQuestion.scoringFormula = scoringFormula;
      choiceQuestion.scoringValue = getScore(scoringValue);
    }
    submitData.choiceQuestion = choiceQuestion;
  } else if (isFillBlankQuestion(questionForm)) {
    // 如果是填空题，需要将一些字段收集出来
    const { answers, answerRequest, scoringValue } = questionForm;
    const fillQuestion: IQuestionResponse['fillQuestion'] = {
      answers,
      scoringValue: getScore(scoringValue),
      answerIgnoreCase: getAnswerRequestValue(answerRequest.includes('answerIgnoreCase')),
      answerOrder: getAnswerRequestValue(answerRequest.includes('answerOrder')),
    };
    // 校验一下题目数量和总分能不能对的起来，对不起来就做修改，这里是为了弹窗中能够正常编辑
    // 因为弹窗中没有题目设置的部分，所以需要进行自动计算，如果后续这里的兼容逻辑多了，应该
    // 考虑将方法单独独立出去，或者在弹窗的编辑阶段就进行修改
    if (answers.length) {
      const curScore = (fillQuestion.scoringValue || 0) * answers.length;
      const isRightScore = curScore === submitData.score;
      if (!isRightScore) submitData.score = curScore;
    }
    submitData.fillQuestion = fillQuestion;
  }

  return submitData;
}

function getJudgeQuestionForm(questionForm: IQuestionSubmitForm): Partial<IQuestionResponse> {
  const submitData: Partial<IQuestionResponse> = {};

  if (isJudgeQuestion(questionForm)) {
    const judgeQuestion: IQuestionResponse['judgeQuestion'] = {
      rightAnswer: questionForm.rightAnswer,
    };
    submitData.judgeQuestion = judgeQuestion;
  }

  return submitData;
}

function getSubjectiveQuestionForm(questionForm: IQuestionSubmitForm): Partial<IQuestionResponse> {
  const submitData: Partial<IQuestionResponse> = {};

  if (isSubjectiveQuestion(questionForm)) {
    const essayQuestion: IQuestionResponse['essayQuestion'] = {
      answer: questionForm.answer,
    };
    submitData.essayQuestion = essayQuestion;
  }

  return submitData;
}
