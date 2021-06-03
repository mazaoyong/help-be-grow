import {
  IQuestion,
  IQuestionControl,
  MultiSelectQuestionRules,
  FillBlankQuestionRules,
  ExamPublishType,
  ExamLimitType,
  QuestionRule,
} from '../../types';
import { QuestionType } from '../../../types';
import omit from 'lodash/omit';
import { SCORE_DECIMAL } from '../../constants';
import {
  ITemplateCreateEntity,
  IExamPaperCreateEntity,
  ITemplateDetailEntity,
  IQuestionEntity,
  ITemplateEditEntity,
} from '../../api';
import { format } from 'date-fns';
import { safeMul, safeAdd } from '../../utils';
import parseDate from '@youzan/utils/date/parseDate';

const multiplier = 10 ** SCORE_DECIMAL;
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

interface IExtendQuestionControl extends IQuestionControl {
  isScoreSame: boolean;
  isRuleSame: boolean;
}

const getTimeStamp = (dateString) => {
  return dateString ? parseDate(dateString, TIME_FORMAT).getTime() : undefined;
};

/**
 * 计算题目规则的方法
 *
 * 如果同一类型题目分数不同，那么统一分数就是0，否则就是相同的分数。多选题题目的规则也是类似
 * 比如 单选题1的分数是2，单选题2的分数是3，那么统一分数就是0
 *
 * @param {IQuestion[]} questionList 问题列表
 */
export function computeQuestion(questionList: IQuestion[]): IQuestionControl[] {
  const controlList: IExtendQuestionControl[] = [];
  questionList.forEach((item) => {
    let { type, score, grading } = item;
    // 先处理小数
    score = safeMul(score, multiplier);
    const ruleScore = grading ? safeMul(grading.score, multiplier) : 0;
    const last = controlList.find((control) => control.type === type);
    if (!last) {
      const baseInfo: IExtendQuestionControl = {
        type,
        count: 1,
        perScore: score,
        totalScore: score,
        isScoreSame: true,
        isRuleSame: true,
      };
      if (type === QuestionType.Multiple) {
        baseInfo.rule = grading ? grading.rules[0] : MultiSelectQuestionRules.LOSS_SCORE;
        baseInfo.ruleScore = ruleScore;
      }
      if (type === QuestionType.FillBlank) {
        baseInfo.rule = grading ? grading.rules[0] : FillBlankQuestionRules.AVERAGE_SCORE;
        baseInfo.ruleScore = ruleScore;
      }
      controlList.push(baseInfo);
    } else {
      last.count++;
      last.totalScore = safeAdd(score, last.totalScore);
      if (last.isScoreSame && score !== last.perScore) {
        last.isScoreSame = false;
        last.perScore = 0;
      }
      if (
        last.isRuleSame &&
        ((grading && grading.rules[0]) !== last.rule || ruleScore !== last.ruleScore)
      ) {
        last.isRuleSame = false;
        last.ruleScore = 0;
        if (type === QuestionType.Multiple) {
          last.rule = MultiSelectQuestionRules.LOSS_SCORE;
        } else if (type === QuestionType.FillBlank) {
          last.rule = FillBlankQuestionRules.AVERAGE_SCORE;
        }
      }
    }
  });
  controlList.forEach((item) => {
    item.perScore /= multiplier;
    item.totalScore /= multiplier;
    if (item.ruleScore) {
      item.ruleScore /= multiplier;
    }
  });
  return controlList.map((item) => omit(item, 'isScoreSame', 'isRuleSame'));
}

/**
 * 规则分数
 *
 * 具体规则：
 * 1.填空题 只填每空的分数A  总分 = A * 空的个数
 * 2.多选项先输入总分，如果是按选项记分，那么每分限制是总分再除正确选项个数；如果是按少选得分，那么每分限制输入最大是总分
 *
 * @param {IQuestion} question
 * @param {QuestionRule} rule
 * @param {number} score
 * @param {number} maxRuleScore
 */
export function ruleScoreEffect(
  question: IQuestion,
  rule: QuestionRule,
  score: number,
  maxRuleScore?: number,
) {
  // 如果是多选题，需要限制规则分数
  if (question.type === QuestionType.Multiple) {
    let maxScore = maxRuleScore || 0;
    if (maxRuleScore === undefined) {
      maxScore = computeMaxRuleScore(question, QuestionType.Multiple, rule);
    }
    score > maxScore && (score = maxScore);
  }

  question.grading = {
    rules: [rule],
    score,
  };
  // 如果是填空题，需要重新计算总分
  if (rule === FillBlankQuestionRules.AVERAGE_SCORE) {
    question.score = safeMul(score, question.answers ? question.answers.length : 0);
  }
}

// 计算最大的规则分数，仅限于多选题
export function computeMaxRuleScore(
  question: IQuestion,
  type: QuestionType,
  rule: QuestionRule,
): number {
  if (type === QuestionType.Multiple) {
    // 按选项记分，计算所有选项可得的最高分
    if (rule === MultiSelectQuestionRules.OPTION_SCORE) {
      const optionLength = question.answers ? question.answers.length : 1;
      const averageScore = question.score / optionLength;
      return averageScore;
      // 少选得分
    } else if (rule === MultiSelectQuestionRules.LOSS_SCORE) {
      return question.score;
    }
  }
  return 0;
}

export function adaptSettingData(originalData: any): ITemplateCreateEntity {
  const data: ITemplateCreateEntity = {} as ITemplateCreateEntity;
  data.title = originalData.name;
  data.picture = originalData.cover;
  data.detail = originalData.detail;
  data.courseSetting = {
    open: originalData.relatedCourse.open ? 1 : 0,
    courseAliases: originalData.relatedCourse.data.map((item) => item.alias),
  };
  data.infoCollectSetting = {
    open: originalData.infoCollectOpen ? 1 : 0,
    attributeIds: originalData.infoCollectOpen ? originalData.infoCollect.customizeItems : [],
    inClue: originalData.infoCollectOpen ? originalData.infoCollect.inClue : 0,
  };
  data.publishType = originalData.pubConfig.type;
  data.timerPublishAt = getTimeStamp(originalData.pubConfig.time);
  data.validity = {
    validityType: originalData.validConfig.type,
    startTime: originalData.validConfig.rangeTime
      ? getTimeStamp(originalData.validConfig.rangeTime[0])
      : undefined,
    endTime: originalData.validConfig.rangeTime
      ? getTimeStamp(originalData.validConfig.rangeTime[1])
      : undefined,
  };
  data.duration = safeMul(originalData.duration, 60);
  data.examFrequency = {
    limitType: originalData.timesConfig.type,
    limitTimes: originalData.timesConfig.times,
    repeatInterval: originalData.reexamInterval !== undefined
      ? safeMul(originalData.reexamInterval, 60, 60)
      : undefined,
  };
  data.displayType = originalData.answerDisplay;
  return data;
}

export function adaptEditSettingData(id: number, originalData: any): ITemplateEditEntity {
  const data = adaptSettingData(originalData);
  return {
    ...data,
    id,
  };
}

export function reverseAdaptSettingData(data: ITemplateDetailEntity): any {
  const formData: any = {};
  formData.name = data.title;
  formData.cover = data.picture;
  formData.detail = data.detail;
  formData.relatedCourse = {
    open: data.courseSettingDetail.open > 0,
    data: data.courseSettingDetail.courseDetails.map((item) => {
      return {
        ...item,
        goodsId: item.id,
      };
    }),
  };
  formData.infoCollectOpen = data.infoCollectSetting.open > 0;
  if (formData.infoCollectOpen) {
    formData.infoCollect = {
      customizeItems: data.infoCollectSetting.attributeIds,
      inClue: data.infoCollectSetting.inClue,
    };
  }
  formData.pubConfig = {
    type: data.publishType,
  };
  if (data.publishType === ExamPublishType.TIMER) {
    formData.pubConfig.time = format(data.timerPublishAt || Date.now(), TIME_FORMAT);
  }
  formData.validConfig = {
    type: data.validity.validityType,
  };
  if (data.validity.startTime && data.validity.endTime) {
    formData.validConfig.rangeTime = [
      format(data.validity.startTime, TIME_FORMAT),
      format(data.validity.endTime, TIME_FORMAT),
    ];
  }
  formData.duration = data.duration / 60;
  formData.timesConfig = {
    type: data.examFrequency.limitType,
    times: data.examFrequency.limitTimes,
  };
  if (
    data.examFrequency.limitType === ExamLimitType.NO_LIMIT ||
    (data.examFrequency.limitTimes || 1) > 1
  ) {
    formData.reexamInterval =
      data.examFrequency.repeatInterval != null
        ? data.examFrequency.repeatInterval / 60 / 60
        : undefined;
  } else {
    formData.reexamInterval = 0;
  }
  formData.answerDisplay = data.displayType;
  return formData;
}

export function adaptQuestionData(
  templateId: number,
  questionList: IQuestion[],
): IExamPaperCreateEntity {
  const data: IExamPaperCreateEntity = {} as IExamPaperCreateEntity;
  data.examTemplateId = templateId;
  data.examQuestions = questionList.map((item, index) => {
    return {
      id: item.id,
      score: safeMul(item.score, multiplier),
      serialNo: index,
      grading: item.grading
        ? {
          rules: item.grading.rules,
          score: safeMul(item.grading.score, multiplier),
        }
        : undefined,
    };
  });
  return data;
}

export function reverseAdaptQuestionData(questions: IQuestionEntity[]): IQuestion[] {
  const questionList: IQuestion[] = questions.map((item) => {
    const baseInfo: IQuestion = {
      id: item.id,
      score: item.question.score / multiplier,
      title: item.question.title,
      type: item.question.type,
      level: item.question.level,
      options: item.question.options,
      answers: item.answer.answers,
      analysis: item.answer.analysis,
    };
    if (item.answer.grading) {
      baseInfo.grading = item.answer.grading;
      baseInfo.grading.score /= multiplier;
    }
    return baseInfo;
  });
  return questionList;
}
