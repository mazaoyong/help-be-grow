import { GetterTree, Getter } from 'vuex';
import { ResultState } from './state';
import { ExamState } from 'supv/examination/store/state';
import { ExamStatus } from 'supv/examination/types';
import { ACTION_STATUS } from '../constants';

interface ResultGetters extends GetterTree<ResultState, any> {
  resultActionStatus: Getter<ResultState, ExamState>;
}

const getters: ResultGetters = {
  resultActionStatus(state): number {
    const {
      examStatus,
      canReexam,
      reexamLeftSeconds,
      publishStatus,
    } = state;

    // 如果考试未发布且考试已开始
    if (publishStatus === 1 && canReexam && examStatus === ExamStatus.STARTED) {
      if (reexamLeftSeconds) {
        return ACTION_STATUS.WILL_REEXAM;
      } else {
        return ACTION_STATUS.CAN_REEXAM;
      }
    } else {
      return ACTION_STATUS.CANNOT_REEXAM;
    }
  },
};

export default getters;
