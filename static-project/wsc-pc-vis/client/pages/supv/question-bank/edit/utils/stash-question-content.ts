import SessionStorage from '@youzan/utils/browser/session_storage';
import { QuestionType } from '@ability-center/supv/question-bank';
import pick from 'lodash/pick';

import { IQuestionSubmitForm } from '../types';

enum SuffixNameList {
  Single = 'select',
  Multiple = 'select',
  Judge = 'judge',
  FillBlank = 'fillBlank',
  Subjective = 'subjective',
}
const commonKeys: Array<keyof IQuestionSubmitForm> = ['title', 'answerAnalysis'];
const prefixName = 'stashQuestion-';

function stashQuestionContent(type: QuestionType, value: Record<string, any>) {
  if (Object.keys(value)) {
    const commonValue = pick(value, commonKeys);
    const suffixName = getSpecificSuffixName(type);
    if (suffixName) {
      let specificKeys: any[] = [];
      switch (type) {
        case QuestionType.Multiple:
        case QuestionType.Single:
          specificKeys = ['questionOptions'];
          break;
        case QuestionType.FillBlank:
          specificKeys = ['answers'];
          break;
        default:
          break;
      }

      const specificValue = pick(value, specificKeys);
      sessionStorage.setItem(prefixName + 'common', JSON.stringify(commonValue));
      // 如果是多选题，需要将是否是正确的字段全部设置成false
      if (type === QuestionType.Multiple) {
        const questionOptions = specificValue.questionOptions;
        if (questionOptions && Array.isArray(questionOptions)) {
          questionOptions.forEach((option) => (option.rightAnswer = false));
        }
      }
      SessionStorage.setItem(prefixName + suffixName, JSON.stringify(specificValue));
    }
  }
}

function getSpecificSuffixName(type: QuestionType): SuffixNameList | '' {
  switch (type) {
    case QuestionType.Multiple:
    case QuestionType.Single:
      return SuffixNameList.Single;
    case QuestionType.Judge:
      return SuffixNameList.Judge;
    case QuestionType.FillBlank:
      return SuffixNameList.FillBlank;
    case QuestionType.Subjective:
      return SuffixNameList.Subjective;
    default:
      return '';
  }
}

function getStashQuestionContent(type: QuestionType): Record<string, any> | null {
  const suffixName = getSpecificSuffixName(type);
  if (suffixName) {
    const commonValueStr = sessionStorage.getItem(prefixName + 'common');
    const specificValueStr = sessionStorage.getItem(prefixName + suffixName);
    if (commonValueStr) {
      try {
        const commonValueJSON = JSON.parse(commonValueStr);
        const specificValueJSON = specificValueStr ? JSON.parse(specificValueStr) : {};
        return Object.assign(commonValueJSON, specificValueJSON);
      } catch (err) {
        console.error(err);
        return null;
      }
    }
  }
  return null;
}

function resetStashedQuestion() {
  sessionStorage.removeItem(prefixName + 'common');
  Object.keys(SuffixNameList).forEach((key) =>
    sessionStorage.removeItem(prefixName + SuffixNameList[key]),
  );
}

export default stashQuestionContent;
export { getStashQuestionContent, resetStashedQuestion };
