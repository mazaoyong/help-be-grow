import formatDate from '@youzan/utils/date/formatDate';
import type { IHomeworkListDTO, IHomeworkDetailDTO } from '../types/homework';
import type { IHomeworkPageDTO } from 'definitions/api/owl/pc/HomeworkFacade/findPageByCondition';
import type { IBusinessHomeworkDTO } from 'definitions/api/owl/pc/HomeworkFacade/getHomeworkDetail';
import { parseDetail } from '../utils';

/** 作业本中作业列表 */
export const parseListData = (data: IHomeworkPageDTO[]): IHomeworkListDTO[] => {
  return data?.map(item => {
    const {
      publishTime,
      exerciseBookId,
      kdtId,
      title,
      dueNum,
      alias,
      submitNum,
      id,
      deadline,
      submitRate,
      toReviewNum,
      status,
    } = item;
    return {
      id,
      alias,
      title,
      kdtId,
      workbookId: exerciseBookId,
      publishTime,
      deadlineTime: deadline,
      submitNum,
      totalNum: dueNum,
      submitRatio: String(submitRate),
      awaitMarkingNum: toReviewNum,
      status,
    };
  });
};

/** 获取作业详情，后端数据转化为表单格式 */
export const parseHomeworkDetail = (data: IBusinessHomeworkDTO): IHomeworkDetailDTO => {
  const {
    id,
    scoreStyle,
    exerciseBookId,
    timerPublish,
    submitNum,
    submitTotalNum,
    alias,
    publishTime,
    scoreRule,
    detail,
    title,
    deadline,
    status,
  } = data;

  return {
    id,
    workbookId: exerciseBookId,
    rateType: scoreStyle,
    hasPublishTimer: timerPublish,
    submitNum,
    submitTotalNum,
    alias,
    timerPublishAt: publishTime,
    scoreRule,
    detail: parseDetail(detail),
    title,
    deadlineTime: deadline,
    status,
  };
};

/** 提交作业详情，转化为后端所需数据格式 */
export const toHomeworkDetail = (data: IHomeworkDetailDTO): IBusinessHomeworkDTO => {
  const {
    id,
    workbookId,
    rateType,
    hasPublishTimer,
    submitNum,
    submitTotalNum,
    alias,
    timerPublishAt,
    scoreRule,
    detail,
    title,
    deadlineTime,
    status,
  } = data;

  return {
    id,
    scoreStyle: rateType,
    exerciseBookId: workbookId,
    timerPublish: hasPublishTimer,
    submitNum,
    submitTotalNum,
    alias,
    publishTime: timerPublishAt && formatDate(timerPublishAt, 'YYYY-MM-DD HH:mm:ss'),
    scoreRule,
    detail,
    title,
    deadline: deadlineTime && formatDate(deadlineTime, 'YYYY-MM-DD HH:mm:ss'),
    status,
  };
};
