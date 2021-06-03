import get from 'lodash/get';
import { QuestionType } from '@ability-center/supv/question-bank';

import parseRichtext2JSON from './parse-richtext2json';
import {
  IQuestionContentForm,
  IQuestionSelectForm,
  IQuestionFillBlankForm,
  IQuestionJudgeForm,
  IQuestionSubjectiveForm,
} from '../types';

type MaybeError = string | null;
type PreSubmitRes = Promise<IQuestionContentForm>;
function preSubmitQuestion(
  type: QuestionType,
  questionContentForm: IQuestionContentForm,
): PreSubmitRes {
  const contentFormWithType: IQuestionContentForm = Object.assign({}, questionContentForm, {
    type,
  });
  return new Promise((resolve, reject) => {
    // 设置form的type属性
    checkQuestionForm(contentFormWithType)
      .then(() => {
        // 转换标题和解析部分
        parseRichtextByPath(questionContentForm, 'title');
        parseRichtextByPath(questionContentForm, 'answerAnalysis');

        switch (type) {
          case QuestionType.Single:
          case QuestionType.Multiple:
            parseSelectType(questionContentForm as IQuestionSelectForm);
            break;
          case QuestionType.Subjective:
            parseSubjectiveType(questionContentForm as IQuestionSubjectiveForm);
            break;
          default:
            break;
        }
        resolve(questionContentForm);
      })
      .catch((errorMsg) => reject(errorMsg || '格式化试题内容出错'));
  });
}

export default preSubmitQuestion;
export function isSelectQuestion(form: IQuestionContentForm): form is IQuestionSelectForm {
  return [QuestionType.Single, QuestionType.Multiple].includes(form.type);
}
export function isFillBlankQuestion(form: IQuestionContentForm): form is IQuestionFillBlankForm {
  return form.type === QuestionType.FillBlank;
}
export function isJudgeQuestion(form: IQuestionContentForm): form is IQuestionJudgeForm {
  return form.type === QuestionType.Judge;
}
export function isSubjectiveQuestion(form: IQuestionContentForm): form is IQuestionSubjectiveForm {
  return form.type === QuestionType.Subjective;
}

function checkStepByStep<T = any>(callback: (form: T) => MaybeError) {
  return function handlePromiseCallback(formValues: T): Promise<T> {
    return new Promise((resolve, reject) => {
      const error = callback(formValues);
      if (error !== null) return reject(error);
      return resolve(formValues);
    });
  };
}
function checkQuestionForm(contentFormWithType: IQuestionContentForm): Promise<MaybeError> {
  return new Promise((resolve, reject) => {
    if (isSelectQuestion(contentFormWithType)) {
      checkStepByStep(checkRightAnswerLength)(contentFormWithType)
        .then(checkStepByStep(checkAnswerLength))
        .then(() => resolve(null))
        .catch((err) => reject(err));
    } else {
      resolve(null);
    }
  });
}

function checkRightAnswerLength(contentFormWithType: IQuestionSelectForm): MaybeError {
  const errorMsg =
    contentFormWithType.type === QuestionType.Single
      ? '单选题需要设置一个正确选项'
      : '多选题需要设置至少两个正确选项';
  const size = contentFormWithType.type === QuestionType.Single ? 1 : 2;
  const { questionOptions } = contentFormWithType;
  if (Array.isArray(questionOptions) && questionOptions.length) {
    const rightAnswerQuestions = questionOptions.filter((option) => option && option.rightAnswer);
    return rightAnswerQuestions.length >= size ? null : errorMsg;
  } else {
    contentFormWithType.questionOptions = [];
    console.error('[question options]必须是数组');
    return null;
  }
}

function checkAnswerLength(contentFormWithType: IQuestionSelectForm): MaybeError {
  const errorMsg =
    contentFormWithType.type === QuestionType.Single
      ? '单选题需要设置至少两个选项'
      : '多选题需要设置至少三个选项';
  const size = contentFormWithType.type === QuestionType.Single ? 2 : 3;
  const { questionOptions } = contentFormWithType;
  if (Array.isArray(questionOptions) && questionOptions.length) {
    return questionOptions.length >= size ? null : errorMsg;
  } else {
    contentFormWithType.questionOptions = [];
    console.error('[question options]必须是数组');
    return null;
  }
}

// 根据path转换富文本
function parseRichtextByPath(contentForm: Record<string, any>, path: string) {
  try {
    const targetStr = get(contentForm, path, '');
    if (targetStr) {
      const parsedJSONObject = parseRichtext2JSON(targetStr);
      const stringifyTargetJSONObject = JSON.stringify(parsedJSONObject);
      contentForm[path] = stringifyTargetJSONObject;
    }
  } catch (err) {
    console.error(err);
  }
}

function parseSelectType(contentForm: IQuestionSelectForm) {
  const { questionOptions } = contentForm;
  if (Array.isArray(questionOptions) && questionOptions.length) {
    const shallowCloneOptions = ([] as IQuestionSelectForm['questionOptions']).concat(
      questionOptions,
    );
    shallowCloneOptions.forEach((option) => {
      if (option) {
        parseRichtextByPath(option, 'options');
      }
    });
  }
}

function parseSubjectiveType(contentForm: IQuestionSubjectiveForm) {
  parseRichtextByPath(contentForm, 'answer');
}
