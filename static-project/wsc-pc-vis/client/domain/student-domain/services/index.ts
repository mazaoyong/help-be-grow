import { Notify } from 'zent';
import HomeworkStudent from '../entities/homework-student';
import { getWorkbookStudentList } from '../data-source/apis';
import { parseStudentListData } from '../data-source/translator';
import { IWorkbookStudentListQuery } from '../types/homework-student';

const service = {
  /**
   * 获取作业本学员列表概览数据
   * @param {IExerciseStudentPageQuery} query
   * @param {IPageRequest} pageRequest
   */

  onGetWorkbookStudentList({ query, pageRequest }: IWorkbookStudentListQuery) {
    return getWorkbookStudentList({ query, pageRequest })
      .then(res => {
        const { content: rawContent, total, pageable } = res;
        const parsedStudentList = parseStudentListData(rawContent);
        const parsedContent = parsedStudentList.map(student => {
          const workbookStudent = new HomeworkStudent(student);
          return workbookStudent.getListData();
        });

        return {
          dataset: parsedContent,
          pageInfo: { total, ...pageable },
          ...res,
        };
      })
      .catch(e => {
        Notify.error(e || '获取作业本学员列表失败，请稍后刷新重试');
      });
  },
};

export default service;
