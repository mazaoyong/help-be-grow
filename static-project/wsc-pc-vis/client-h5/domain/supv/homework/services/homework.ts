import { Toast } from 'vant'
import Homework from '../entities/Homework';
import fetchHomeworkApi from '../data-source/apis/fetchHomework';
import fetchEditHomeworkApi from '../data-source/apis/fetchEditHomework';
import createHomeworkApi from '../data-source/apis/createHomework';
import updateHomeworkApi from '../data-source/apis/updateHomework';
import fetchHomeworkListApi from '../data-source/apis/fetchAssignmentList';
import { toQuery } from '../data-source/translators/createHomework';
import { toEntity as toHomeowrk } from '../data-source/translators/fetchHomework';
import { REVIEW_STATUS } from '../constants';
import Assignment from '../entities/Assignment';

/**
 * 布置作业
 * @param homework 作业表单
 */
export function createHomework(homework: Homework) {
  return createHomeworkApi(toQuery(homework))
    .then((res: any) => {
      return res;
    })
    .catch((errMsg: string) => {
      Toast(errMsg);
    });
}

export function updateHomework(homework: Homework) {
  return updateHomeworkApi(toQuery(homework))
    .then((res: any) => {
      return res;
    })
    .catch((errMsg: string) => {
      Toast(errMsg);
    });
}

/**
 * 获取作业详情
 */
export function fetchHomeworkDetail(homeworkId: number) {
  return fetchHomeworkApi({
    homeworkId,
  })
    .then((res) => {
      if (res) {
        return {
          homework: new Homework(toHomeowrk(res)),
        };
      } else {
        Toast('获取作业详情失败');
      }
    })
    .catch((errMsg: string) => {
      Toast(errMsg);
    });
}

export function fetchEditHomework(homeworkId: number) {
  return fetchEditHomeworkApi({
    homeworkId,
  })
    .then((res) => {
      if (res) {
        return {
          homework: new Homework(toHomeowrk(res)),
        };
      } else {
        Toast('获取作业详情失败');
      }
    })
    .catch((errMsg: string) => {
      Toast(errMsg);
    });
}

/**
 * 获取某个作业的学生作业列表
 */
export function fetchHomeworkList(data: {
  pageNumber: number
  pageSize: number
  status: REVIEW_STATUS
  homeworkId: number
}) {
  return fetchHomeworkListApi({
    pageRequest: {
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'create_time',
          },
        ],
      },
    },
    query: {
      status: data.status,
      homeworkId: data.homeworkId,
    },
  })
    .then(res => {
      if (res && Array.isArray(res)) {
        return res.map(item => new Assignment(item));
      } else {
        Toast('获取学生作业列表失败');
      }
    })
    .catch((errMsg: string) => {
      Toast(errMsg);
    });
}
