import { Notify } from 'zent';
import {
  getWorkbookHomeworkList,
  deleteHomework,
  getHomeworkDetail,
  createHomework,
  updateHomework,
} from '../data-source/apis';
import { parseListData, toHomeworkDetail, parseHomeworkDetail } from '../data-source/translator';
import HomeworkEntity from '../entities/homework';

import type { IHomeworkListQuery, IHomeworkDetailDTO } from '../types/homework';
import type {
  IHomeworkPageDTO,
  IPage,
} from 'definitions/api/owl/pc/HomeworkFacade/findPageByCondition';
import type { IBusinessHomeworkDTO } from 'definitions/api/owl/pc/HomeworkFacade/getHomeworkDetail';

const service = {
  /**
   * 查询作业本作业列表
   * @param {IHomeworkPageQuery} query
   * @param {IPageRequest} pageRequest
   */

  onFetchHomeworkList(payload: IHomeworkListQuery) {
    return getWorkbookHomeworkList(payload)
      .then((res: IPage<IHomeworkPageDTO>) => {
        const { content: rawContent, total, pageable } = res;
        const parsedContent = parseListData(rawContent || []).map((homework) => {
          const homeworkDTO = new HomeworkEntity(homework);
          return homeworkDTO.getListData();
        });

        return {
          dataset: parsedContent,
          pageInfo: { total, ...pageable },
          ...res,
        };
      })
      .catch((e) => {
        Notify.error(e || '获取作业列表失败，请稍后刷新重试');
      });
  },

  /**
   * 删除作业本作业
   * @param {number} id
   */

  deleteHomework(payload: { id: number }) {
    return deleteHomework(payload);
  },

  /** 查询作业详情
   * @param {number} homeworkId
   */

  onFetchHomeworkData(payload: { homeworkId: number }) {
    return getHomeworkDetail(payload)
      .then((res: IBusinessHomeworkDTO) => {
        const homework = new HomeworkEntity(parseHomeworkDetail(res));
        return homework.getHomeworkDetail();
      });
  },

  /**
   * 新建作业
   * @param {IHomeworkDetailDTO} payload
   */

  onCreateHomework(payload: IHomeworkDetailDTO) {
    return createHomework(toHomeworkDetail(payload));
  },

  /**
   * 编辑作业
   * @param {IHomeworkDetailDTO} payload
   */

  onUpdateHomework(payload: IHomeworkDetailDTO) {
    return updateHomework(toHomeworkDetail(payload));
  },
};

export default service;
