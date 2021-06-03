import { QuestionType, ScoringFormula, IParagraph } from '@ability-center/supv/question-bank';
import pick from 'lodash/pick';
import get from 'lodash/get';

import {
  IQuestionResponse,
  IQuestionSettingForm,
  IQuestionSubmitForm,
  FillQuestionRequestSetting,
  OptionsOrder,
  QuestionItem,
} from '../types';
import getConvertString from '../../utils/get-convert-string';

// prettier-ignore
export type IQuestionSubmitSettingForm = IQuestionSettingForm & Pick<IQuestionResponse, 'categoryName'>;
// prettier-ignore
const questionSettingPickKey: Partial<keyof IQuestionResponse>[] = ['type', 'level', 'categoryId', 'categoryName'];
// prettier-ignore
const questionContentPickKey: Partial<keyof IQuestionResponse>[] = ['title', 'answerAnalysis', 'type'];

function separateResponse(
  responseData: IQuestionResponse,
): [IQuestionSubmitSettingForm, IQuestionSubmitForm] | null {
  if (Object.keys(responseData)) {
    const { type } = responseData;
    // @ts-ignore
    const tempQuestionSetting: IQuestionSettingForm = pick(responseData, questionSettingPickKey);
    appendFloatScore(tempQuestionSetting, responseData);
    appendScoringFormula(type, tempQuestionSetting, responseData);
    appendScoringValue(type, tempQuestionSetting, responseData);

    // @ts-ignore
    const tempQuestionContent: IQuestionSubmitForm = pick(responseData, questionContentPickKey);
    convertRichtext(tempQuestionContent);
    switch (type) {
      case QuestionType.Single:
      case QuestionType.Multiple:
        appendSelectValue(tempQuestionContent, responseData);
        break;
      case QuestionType.Judge:
        appendJudgeValue(tempQuestionContent, responseData);
        break;
      case QuestionType.FillBlank:
        appendFillBlankValue(tempQuestionContent, responseData);
        break;
      case QuestionType.Subjective:
        appendSubjectiveValue(tempQuestionContent, responseData);
        break;
      default:
        break;
    }
    // @upgrade: zent8
    // @ts-ignore  删除type
    delete tempQuestionContent.type;

    return [tempQuestionSetting, tempQuestionContent];
  }
  return null;
}

export default separateResponse;

function getConvert(paragraph: IParagraph): string {
  const { type, attr = '', text = '', src = '', size, nodes } = paragraph;
  const source = src ? ` src=${src}` : '';
  if (nodes.length) {
    if (type !== '') {
      return `<${type}${attr}>${text + nodes.map(getConvert).join('')}</${type}>`;
    }
    return text + nodes.map(getConvert).join('');
  }
  if (type === '') return text;
  else if (['img', 'br'].includes(type)) {
    const sizeStr = size ? ` data-origin-height=${size.h} data-origin-width=${size.w}` : '';
    return `<${type}${attr}${source}${sizeStr} />`;
  }
  return `<${type}${attr}${source}>${text}</${type}>`;
}

function convertRichtext(sourceData: Partial<IQuestionSubmitForm>) {
  const { title = '', answerAnalysis = '' } = sourceData;
  sourceData.title = getConvertString(title, getConvert);
  sourceData.answerAnalysis = getConvertString(answerAnalysis, getConvert);
}

// 格式化分数 number / 100
function convertScore(responseData: IQuestionResponse, path: string): string {
  const score = get(responseData, path, 0);
  return String(Number(score / 100));
}
function appendFloatScore(
  sourceData: Partial<IQuestionSettingForm>,
  responseData: IQuestionResponse,
) {
  sourceData.score = convertScore(responseData, 'score');
}

function appendScoringFormula(
  type: QuestionType,
  sourceData: Partial<IQuestionSettingForm>,
  responseData: IQuestionResponse,
) {
  if (type === QuestionType.Multiple) {
    sourceData.scoringFormula = get(
      responseData,
      'choiceQuestion.scoringFormula',
      ScoringFormula.Less,
    );
  }
}

function appendScoringValue(
  type: QuestionType,
  sourceData: Partial<IQuestionSettingForm>,
  responseData: IQuestionResponse,
) {
  const pathMap = {
    [QuestionType.FillBlank]: 'fillQuestion',
    [QuestionType.Multiple]: 'choiceQuestion',
  };
  const includeScoreTypes = [QuestionType.Single, QuestionType.Multiple, QuestionType.FillBlank];
  if (includeScoreTypes.includes(type)) {
    sourceData.scoringValue = convertScore(responseData, `${pathMap[type]}.scoringValue`);
  }
}

function appendSelectValue(
  sourceData: Partial<IQuestionSubmitForm>,
  responseData: IQuestionResponse,
) {
  if (sourceData.type === QuestionType.Single || sourceData.type === QuestionType.Multiple) {
    const originOptions: QuestionItem[] = get(responseData, 'choiceQuestion.questionOptions', [
      { options: '', rightAnswer: false },
    ]);
    sourceData.questionOptions = originOptions.map((opt) => {
      opt.options = getConvertString(opt.options, getConvert);
      return opt;
    });
    sourceData.optionOrder = get(responseData, 'choiceQuestion.optionOrder', OptionsOrder.Fixed);
  }
}

function appendJudgeValue(
  sourceData: Partial<IQuestionSubmitForm>,
  responseData: IQuestionResponse,
) {
  if (sourceData.type === QuestionType.Judge) {
    sourceData.rightAnswer = get(responseData, 'judgeQuestion.rightAnswer', false);
  }
}

function checkAnswerRequest(value: FillQuestionRequestSetting): boolean {
  return value === FillQuestionRequestSetting.Available;
}
function appendFillBlankValue(
  sourceData: Partial<IQuestionSubmitForm>,
  responseData: IQuestionResponse,
) {
  if (sourceData.type === QuestionType.FillBlank) {
    sourceData.answers = get(responseData, 'fillQuestion.answers', []);

    const answerIgnoreCase = get(
      responseData,
      'fillQuestion.answerIgnoreCase',
      FillQuestionRequestSetting.Disabled,
    );
    const answerOrder = get(
      responseData,
      'fillQuestion.answerOrder',
      FillQuestionRequestSetting.Disabled,
    );
    const answerRequest: any[] = [];
    if (checkAnswerRequest(answerIgnoreCase)) {
      answerRequest.push('answerIgnoreCase');
    }
    if (checkAnswerRequest(answerOrder)) {
      answerRequest.push('answerOrder');
    }
    sourceData.answerRequest = answerRequest;
  }
}

function appendSubjectiveValue(
  sourceData: Partial<IQuestionSubmitForm>,
  responseData: IQuestionResponse,
) {
  if (sourceData.type === QuestionType.Subjective) {
    sourceData.answer = getConvertString(get(responseData, 'essayQuestion.answer', ''), getConvert);
  }
}
