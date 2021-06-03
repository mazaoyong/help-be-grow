import { Notify } from 'zent';
import { getAssignment, getCorrectSiblingIds, review } from '../data-source/apis';
import {
  parseCorrectData,
  parseCorrectFormData,
  parseCorrectSibilingsQuery,
} from '../data-source/translator';
import CorrectEntity from '../entities/correct';

import type { ICorrectDTO, ICorrectDetailData, ICorrectSibilingsQuery } from '../types';
import type { IAssignmentDTO } from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';
import type { IAssignmentSortDTO } from 'definitions/api/owl/pc/ReviewerFacade/assignmentSort';

const service = {
  /**
   * 查询学生作业获取批阅详情
   * @param {number} id
   */

  fetchAssignment(payload: { id: number }): Promise<ICorrectDTO | void> {
    return getAssignment(payload)
      .then((res: IAssignmentDTO) => {
        const correct = new CorrectEntity(parseCorrectData(res));
        return correct.getCorrectData();
      })
      .catch((e) => {
        Notify.error(e || '获取批阅详情失败，请稍后刷新重试');
      });
  },

  /**
   * 查询批阅上一个、下一个信息
   */
  fetchCorrectSiblings(payload: ICorrectSibilingsQuery) {
    return getCorrectSiblingIds(parseCorrectSibilingsQuery(payload))
      .then((res: IAssignmentSortDTO) => {
        const correct = new CorrectEntity(res);
        return correct.getCorrectSibilings();
      })
      .catch((e) => {
        Notify.error(e || '获取相邻批阅详情失败，请稍后重试');
      });
  },

  /**
   * 批阅
   */
  postCorrectReview(payload: ICorrectDetailData) {
    return review(parseCorrectFormData(payload));
  },
};

export default service;
