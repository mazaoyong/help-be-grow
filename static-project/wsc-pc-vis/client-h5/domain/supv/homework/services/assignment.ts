import { Toast } from 'vant';
import { ref } from '@youzan/tany-vue';
import fetchAssignmentListApi from '../data-source/apis/fetchAssignmentList';
import fetchAssignmentApi from '../data-source/apis/fetchAssignment';
import createReviewApi from '../data-source/apis/createReview';
import switchAssignmentApi from '../data-source/apis/switchAssignment';
import fetchAssignmentSiblingsApi from '../data-source/apis/fetchAssignmentSiblings';
import fetchLatestCommentApi from '../data-source/apis/fetchLatestComment';
import { DEFAULT_AVATAR, REVIEW_STATUS } from '../constants';
import Assignment from '../entities/Assignment';
import { toEntity } from '../data-source/translators/fetchAssignment';
import {
  IReviewCommand,
} from 'definitions/api/owl/api/ReviewerExerciseFacade/review';
import { IAssignmentSortQuery } from 'definitions/api/owl/pc/ReviewerFacade/assignmentSort';
import fetchPoster from 'domain/common/data-source/apis/fetchPoster';
import { getQrcode } from '@/pages-api/common';

export function createAssignmentListApi(
  homeworkId: string,
  status: REVIEW_STATUS,
) {
  return ({ page, pageSize }: { page: number, pageSize: number }) => {
    const loadedRef = ref(0);

    return fetchAssignmentListApi({
      pageRequest: {
        pageNumber: page,
        pageSize,
        sort: {
          orders: [
            {
              direction: 'DESC',
              property: status === REVIEW_STATUS.REVIEWED ? 'review_time' : 'submit_time',
            },
          ],
        },
      },
      query: {
        homeworkId: Number(homeworkId),
        status,
      },
    })
      .then(res => {
        if (res) {
          loadedRef.value += res.content?.length || 0;

          return {
            list: res.content,
            hasNext: Number(res.total) > loadedRef.value,
          };
        } else {
          Toast('获取学生作业列表失败');
        }
      })
      .catch(errMsg => {
        Toast(errMsg || '获取学生作业列表失败');

        return {
          list: [],
          hasNext: false,
        };
      });
  }
};

export function fetchAssignment(assignmentId: number) {
  return fetchAssignmentApi(assignmentId)
    .then(res => {
      console.log('获取到学生作业详情：', res);
      if (res) {
        return {
          assignment: new Assignment(toEntity(res)),
        };
      } else {
        Toast('获取学生作业详情失败');
      }
    })
    .catch((errMsg: string) => {
      Toast(errMsg|| '获取学生作业详情失败');
    });
}

export function createReview(command: IReviewCommand) {
  return createReviewApi(command);
}

export function switchAssignment(query: IAssignmentSortQuery) {
  return switchAssignmentApi(query);
}

export function fetchAssignmentSiblings(query: IAssignmentSortQuery) {
  return fetchAssignmentSiblingsApi(query)
    .catch((errMsg: string) => Toast(errMsg));
}

export function fetchLatestComment() {
  return fetchLatestCommentApi()
    .then(res => {
      if (res && res.content) {
        return res.content[0]?.comment;
      }
      return [];
    })
    .catch((errMsg: string) => Toast(errMsg));
}

export function fetchAssignmentPoster(
  assignment: Assignment,
  detail: any,
  comment: any,
) {
  return getQrcode({
    url: `https://h5.youzan.com/wscvis/supv/homework/assignment?assignmentId=${assignment.id}&studentId=${assignment.student?.userId}`,
  })
    .then((url: string) => {
      return fetchPoster({
        pathname: 'supv/homework/assignment-poster',
        data: {
          avatar: _global.visUserInfo?.avatar || DEFAULT_AVATAR,
          shareTitle: `${_global.visUserInfo?.nickName}老师`,
          shareDesc: `向大家展示${assignment.student?.name}同学的作业`,
          shareUserName: _global.visUserInfo?.nickName || '老师',
          studentName: assignment.student?.name || '学生',
          title: assignment.homework?.title,
          scoreStyle: assignment.homework?.reviewSettings.scoreType,
          scoreRule: assignment.homework?.reviewSettings.scoreRule,
          score: assignment.score,
          isExcellent: assignment.selected,
          exposeAssignmentBlocks: detail,
          exposeCorrectMediaBlocks: comment,
          qrCodeUrl: url,
        },
        snapshotConfig: {
          selector: '.assignment-poster',
          type: 'png',
        },
      }).then(res => {
        if (res) {
          return res.img;
        }
        return '';
      });
    });
}
