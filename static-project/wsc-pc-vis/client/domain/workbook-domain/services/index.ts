import { Notify } from 'zent';
import {
  getWorkbookList,
  toggleWorkbookStockStatus,
  deleteWorkbook,
  createWorkbook,
  updateWorkbook,
  getWorkbookDetail,
  getWorkbookSummary,
  getEduClassList,
  getEduClassWorkbookList,
  exportWorkbookStudent,
  getExerciseReward,
  saveExerciseReward
} from '../data-source/apis';
import {
  parseListData,
  workbookDataToFormData,
  parseEduClassWorkbookList,
  formToWorkbookData,
  parseWorkbookSummary,
} from '../data-source/translator';
import WorkbookEntity from '../entities/workbook';
import {
  IWorkbookListQuery,
  IWorkbookSummaryQuery,
  IWorkbookFormEdit,
  IWorkbookFormAdd,
  workbookPublishStatus,
} from '../types';
import type {
  IExerciseBookPageDTO,
  IPage,
  IPageRequest,
} from 'definitions/api/owl/pc/ExerciseBookFacade/findPageByCondition';
import type { IExerciseBookDTO } from 'definitions/api/owl/pc/ExerciseBookFacade/getExerciseBookDetail';
import type { IExerciseStudentPageQuery } from 'definitions/api/owl/pc/ExerciseBookStatisticsFacade/exportStudent';
import type { IExerciseReward, IKdtId } from 'definitions/api/owl/pc/ExerciseRewardFacade/exerciseReward';

const service = {
  /**
   * 查询作业本列表
   * @param {IExerciseBookPageQuery} query
   * @param {IPageRequest} pageRequest
   */

  onFetchWorkbookList(payload: IWorkbookListQuery) {
    return getWorkbookList(payload)
      .then((res: IPage<IExerciseBookPageDTO>) => {
        const { content: rawContent, total, pageable } = res;
        const parsedContent = parseListData(rawContent || []).map((workbook) => {
          const wb = new WorkbookEntity(workbook);
          return wb.getListData();
        });

        return {
          dataset: parsedContent,
          pageInfo: { total, ...pageable },
          ...res,
        };
      }).catch((e) => {
        Notify.error(e || '获取作业表列表失败，请稍后刷新重试');
      });
  },

  /**
   * 上下架
   * @param {number} id
   * @param {workbookPublishStatus} status
   */

  changeWorkbookStockStatus(payload: { id: number; status: workbookPublishStatus }) {
    return toggleWorkbookStockStatus(payload);
  },

  /**
   * 删除
   * @param {number} id
   */

  deleteWorkbook(payload: { id: number }) {
    return deleteWorkbook(payload);
  },

  /**
   * 创建作业本
   * @param {IWorkbookFormAdd} payload
   */

  createWorkbook(payload: IWorkbookFormAdd) {
    return createWorkbook(formToWorkbookData(payload));
  },

  /**
   * 更新作业本内容
   * @param {IWorkbookFormEdit} payload
   */

  updateWorkbook(payload: IWorkbookFormEdit) {
    return updateWorkbook(formToWorkbookData(payload));
  },

  /**
   * 获取作业本详情
   * @param {number} workbookId
   */

  getWorkbookDetail(payload: { id: number }) {
    return getWorkbookDetail(payload).then((res: IExerciseBookDTO) => {
      const wb = new WorkbookEntity(workbookDataToFormData(res));
      return wb.getPayloadForEdit();
    });
  },

  /**
   * 获取作业本概览数据
   * @param {IWorkbookSummaryQuery} payload
   */

  onGetWorkbookSummary(payload: IWorkbookSummaryQuery) {
    return getWorkbookSummary(payload)
      .then((res) => {
        const wb = new WorkbookEntity(parseWorkbookSummary(res));
        return wb.getWorkbookSummaryData();
      })
      .catch((e) => {
        Notify.error(e || '获取作业表概览数据失败，请稍后刷新重试');
      });
  },

  /** 获取班级列表
   * @param {string} eduClassName
   * @param {IPageRequest} pageRequest
   */

  getClassList(payload: { query: { eduClassName: string }; pageRequest: IPageRequest }) {
    return getEduClassList(payload).catch((e) => {
      Notify.error(e || '获取班级列表失败，请关闭后重试');
    });
  },

  /**
   * 获取班级关联的作业本列表
   * @param query
   * @param {IPageRequest} pageRequest
   */

  fetchEduClassWorkbookList(payload: {
    query: { classId: number, targetKdtId?: number };
    pageRequest: IPageRequest;
  }) {
    return getEduClassWorkbookList(payload)
      .then((res) => {
        const { pageable, total } = res;
        const content = parseEduClassWorkbookList(res.content);
        return {
          content,
          pageable,
          total,
        };
      })
      .catch((e) => {
        Notify.error(e || '获取班级作业本列表失败，请稍后重试');
      });
  },

  /**
   * 作业本管理 - 学员列表导出
   * @param {IExerciseStudentPageQuery} query
   */

  exportWorkbookStudentData(payload: { query: IExerciseStudentPageQuery }) {
    return exportWorkbookStudent(payload).catch((e) => {
      Notify.error(e || '导出作业本学员失败，请稍后重试');
    });
  },

  /**
   * 作业奖励 - 获取
   * @param {IKdtId} query
   */

  getExerciseReward(payload: { query: IKdtId }) {
    return getExerciseReward(payload).catch((e) => {
      Notify.error(e || '奖励规则获取失败，请稍后重试');
      return Promise.reject();
    });
  },

  /**
   * 作业奖励 - 修改
   * @param {IExerciseReward} query
   */

  saveExerciseReward(payload: { query: IExerciseReward }) {
    return saveExerciseReward(payload).catch((e) => {
      Notify.error(e || '奖励规则修改失败，请稍后重试');
      return Promise.reject();
    });
  },
};

export default service;
