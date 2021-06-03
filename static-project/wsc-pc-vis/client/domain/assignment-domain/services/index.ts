import { Notify } from 'zent';
import {
  getWorkbookStudentAssignmentList,
  getHomeworkStudentAssignmentList,
} from '../data-source/apis';
import Assignment from '../entities/assignment';
import {
  parseListData,
  parseWorkbookAssignmentListQuery,
  parseHomeworkAssignmentListQuery,
} from '../data-source/translator';
import type {
  IParsedWorkbookAssignmentListQuery,
  IParsedHomeworkAssignmentListQuery,
} from '../types/assignment';
import type {
  IPage,
  IAssignmentPageDTO,
} from 'definitions/api/owl/pc/AssignmentFacade/findExerciseAssignmentPage';

const service = {
  /** 获取作业本下学生作业列表（作业维度） */
  onFetchWorkbookStudentAssignmentList(payload: IParsedWorkbookAssignmentListQuery) {
    const { query: rawQuery, pageRequest } = payload;
    return getWorkbookStudentAssignmentList({
      query: parseWorkbookAssignmentListQuery(rawQuery),
      pageRequest,
    })
      .then((res: IPage<IAssignmentPageDTO>) => {
        const { content: rawContent, total, pageable } = res;
        const parsedContent = parseListData(rawContent || []).map((assignment) => {
          const assignmentDTO = new Assignment(assignment);
          return assignmentDTO.getWorkbookAssignmentListData();
        });

        return {
          dataset: parsedContent,
          pageInfo: { total, ...pageable },
          ...res,
        };
      })
      .catch((e) => {
        Notify.error(e || '获取学生作业列表失败，请稍后刷新重试');
      });
  },

  /** 获取作业中的学生作业列表（学生维度） */
  onFetchHomeworkStudentAssignmentList(payload: IParsedHomeworkAssignmentListQuery) {
    const { query: rawQuery, pageRequest } = payload;
    return getHomeworkStudentAssignmentList({
      query: parseHomeworkAssignmentListQuery(rawQuery),
      pageRequest,
    })
      .then((res: IPage<IAssignmentPageDTO>) => {
        const { content: rawContent, total, pageable } = res;
        const parsedContent = parseListData(rawContent || []).map((assignment) => {
          const assignmentDTO = new Assignment(assignment);
          return assignmentDTO.getHomeworkAssignmentListData();
        });

        return {
          dataset: parsedContent,
          pageInfo: { total, ...pageable },
          ...res,
        };
      })
      .catch((e) => {
        Notify.error(e || '获取学生作业列表失败，请稍后刷新重试');
      });
  },
};

export default service;
