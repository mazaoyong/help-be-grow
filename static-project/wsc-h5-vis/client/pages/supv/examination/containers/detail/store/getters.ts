import { GetterTree, Getter } from 'vuex';
import { ExamStatus, UserExamStatus } from 'supv/examination/types';
import { ExamState } from 'supv/examination/store/state';
import { ActionStatus } from '../types';
import { DetailState } from './state';

interface DetailGetters extends GetterTree<DetailState, any> {
  actionStatus: Getter<DetailState, ExamState>;
}

const getters: DetailGetters = {
  actionStatus(state): string {
    const {
      status,
      userExamStatus,
      canReexam,
      reexamLeftSeconds,
      publishStatus,
    } = state;

    // 如果考试未发布
    if (publishStatus === 2) {
      if (userExamStatus === UserExamStatus.NOT_JOIN) {
        return ActionStatus.NOT_STARTED;
      }
      if (userExamStatus === UserExamStatus.COMMITED) {
        return ActionStatus.COMMITED;
      }
    }

    // 考试已发布
    // 如果用户已提交
    if (userExamStatus === UserExamStatus.COMMITED) {
      // 如果可以重考
      if (canReexam) {
        // 考试未开始 / 考试已结束
        if (status === ExamStatus.NOT_STARTED || status === ExamStatus.ENDED) {
          return ActionStatus.COMMITED;
        }

        // 如果距离下次重考开始时间 > 0
        if (reexamLeftSeconds > 0) {
          return ActionStatus.WILL_REEXAM;
        } else {
          return ActionStatus.CAN_REEXAM;
        }
      }

      return ActionStatus.COMMITED;
    }

    // 用户未提交试卷
    if (userExamStatus === UserExamStatus.NOT_COMMITED) {
      return ActionStatus.NOT_COMMITED;
    }

    // 用户未参加考试
    if (userExamStatus === UserExamStatus.NOT_JOIN) {
      // 考试未开始
      if (status === ExamStatus.NOT_STARTED) {
        return ActionStatus.NOT_STARTED;
      }
      // 考试已结束
      if (status === ExamStatus.ENDED) {
        return ActionStatus.ENDED;
      }

      return ActionStatus.NOT_JOINED;
    }

    return ActionStatus.NOT_STARTED;
  },
};

export default getters;
